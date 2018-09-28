package routes

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/common/rest"
	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/plugin"
	"github.com/gorilla/mux"
)

type Resources struct {
	context plugin.PluginContext
	router  *mux.Router
	client  *rest.Client
}

func RegisterResources(context plugin.PluginContext, router *mux.Router) {
	log.Println("Resources API", context.PluginDirectory())
	os.MkdirAll(context.PluginDirectory()+"/db", 0755)

	resources := Resources{context: context, router: router, client: rest.NewClient()}
	router.PathPrefix("/db").Handler(http.FileServer(http.Dir(context.PluginDirectory())))
	router.HandleFunc("/api/resources/refresh", resources.refresh)
}

func (resources *Resources) refresh(w http.ResponseWriter, r *http.Request) {
	resources.context.RefreshIAMToken()

	items, err := resources.search0("*")
	if err != nil {
		json.NewEncoder(w).Encode(err)
	} else {
		jsonFile, _ := os.Create(resources.context.PluginDirectory() + "/db/all.json")
		jsonData, _ := json.MarshalIndent(items, "", " ")
		jsonFile.Write(jsonData)
		jsonFile.Close()
		w.WriteHeader(204)
	}
}

type item interface{}

func (resources *Resources) search0(query string) ([]item, error) {

	type searchRequest struct {
		Query string `json:"query"`
	}

	var searchResponse struct {
		Items    []item `json:"items"`
		MoreData bool   `json:"more_data"`
	}

	var allItems = []item{}
	var count = 0
	var offset = 0

	// how much items per page
	var pageLimit = 100

	payload := searchRequest{Query: query}
	for {
		req := rest.PostRequest("https://ghost-api.bluemix.net/v2/resources/search").
			Body(payload).
			Query("offset", strconv.Itoa(count+offset)).
			Query("limit", strconv.Itoa(pageLimit)).
			Set("Authorization", resources.context.IAMToken())

		if resp, err := resources.client.Do(req, &searchResponse, nil); err != nil {
			log.Println(err)
			return []item{}, err
		} else {
			log.Println(resp)
		}

		items := searchResponse.Items
		hasNext := searchResponse.MoreData

		allItems = append(allItems, items...)
		log.Printf("Found %d items so far\n", len(allItems))

		if len(items) == 0 || !hasNext {
			break
		}

		count = count + len(items)
	}

	return allItems, nil
}
