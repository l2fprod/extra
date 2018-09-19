package routes

import (
	"encoding/json"
	"extra/model"
	"log"
	"net/http"

	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/plugin"
	"github.com/gorilla/mux"
)

type User struct {
	context plugin.PluginContext
	router  *mux.Router
}

func RegisterUser(context plugin.PluginContext, router *mux.Router) {
	log.Println("User API")
	user := User{context: context, router: router}
	router.HandleFunc("/api/user", user.get)
}

func (user *User) get(w http.ResponseWriter, r *http.Request) {
	response := model.User{Email: user.context.UserEmail()}
	json.NewEncoder(w).Encode(response)
}
