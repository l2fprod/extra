package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/common/rest"
	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/plugin"
	"github.com/gorilla/mux"
)

type resources struct {
	context plugin.PluginContext
	router  *mux.Router
	client  *rest.Client
}

func RegisterResources(context plugin.PluginContext, router *mux.Router) {
	// log.Println("Resources API", context.PluginDirectory())

	resources := resources{context: context, router: router, client: rest.NewClient()}
	os.MkdirAll(resources.dbDir(), 0755)
	router.PathPrefix("/db").Handler(http.StripPrefix("/db", http.FileServer(http.Dir(resources.dbDir()))))
	router.HandleFunc("/api/resources/refresh", resources.refresh)
}

func (resources *resources) dbDir() string {
	return resources.context.PluginDirectory() + "/db/" + resources.context.CurrentAccount().GUID
}

func (resources *resources) refresh(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Refreshing resources for", resources.context.CurrentAccount().Name)
	resources.context.RefreshIAMToken()

	items, err := resources.search0("*")
	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode(err)
	} else {
		fmt.Println("Refresh complete")
		jsonFile, _ := os.Create(resources.dbDir() + "/all.json")
		jsonData, _ := json.MarshalIndent(items, "", " ")
		jsonFile.Write(jsonData)
		jsonFile.Close()
		w.WriteHeader(204)
	}
}

type item interface{}

func (resources *resources) search0(query string) ([]item, error) {

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

		if _, err := resources.client.Do(req, &searchResponse, nil); err != nil {
			fmt.Println(err)
			return []item{}, err
		} else {
			// log.Println(resp)
		}

		items := searchResponse.Items
		hasNext := searchResponse.MoreData

		allItems = append(allItems, items...)
		fmt.Printf("  Found %d items so far\n", len(allItems))

		if len(items) == 0 || !hasNext {
			break
		}

		count = count + len(items)
	}

	return allItems, nil
}
