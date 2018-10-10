package main

import (
	"extra/routes"
	"fmt"
	"net"
	"net/http"
	"os"

	"github.com/IBM-Cloud/ibm-cloud-cli-sdk/plugin"
	"github.com/gobuffalo/packr"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type ExtraPlugin struct{}

func main() {
	plugin.Start(new(ExtraPlugin))
}

func (pluginDemo *ExtraPlugin) Run(context plugin.PluginContext, args []string) {
	if !context.HasTargetedAccount() {
		fmt.Println("You need to be logged in to use the plugin")
		os.Exit(1)
		return
	}

	r := mux.NewRouter()
	r.Use(mux.CORSMethodMiddleware(r))

	routes.RegisterUser(context, r)
	routes.RegisterResources(context, r)

	box := packr.NewBox("./public")
	r.PathPrefix("/").Handler(http.FileServer(box))

	http.Handle("/", handlers.CORS()(r))

	port := os.Getenv("EXTRA_PORT")
	if port == "" {
		port = "0"
	}

	listener, err := net.Listen("tcp", ":"+port)
	if err != nil {
		panic(err)
	}

	fmt.Println(fmt.Sprintf("Listening at http://localhost:%d", listener.Addr().(*net.TCPAddr).Port))
	panic(http.Serve(listener, nil))
}

func (pluginDemo *ExtraPlugin) GetMetadata() plugin.PluginMetadata {
	return plugin.PluginMetadata{
		Name: "extra",
		Version: plugin.VersionType{
			Major: 0,
			Minor: 0,
			Build: 5,
		},
		Commands: []plugin.Command{
			{
				Name:        "extra",
				Alias:       "xt",
				Description: "an extension for IBM Cloud.",
				Usage:       "ibmcloud extra",
			},
		},
	}
}
