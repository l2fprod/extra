package routes

import (
	"log"
	"net/http"

	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/plugin"
	"github.com/gorilla/mux"
)

type Resources struct {
	context plugin.PluginContext
	router  *mux.Router
}

func RegisterResources(context plugin.PluginContext, router *mux.Router) {
	log.Println("Resources API")
	resources := Resources{context: context, router: router}
	router.HandleFunc("/api/resources/search", resources.search)
}

func (routes *Resources) search(w http.ResponseWriter, r *http.Request) {
}
