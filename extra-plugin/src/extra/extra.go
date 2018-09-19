package main

import (
	"extra/routes"
	"fmt"
	"log"
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
	log.Println("hello extra")

	box := packr.NewBox("./public")

	r := mux.NewRouter()
	r.Path("/").Handler(http.FileServer(box))

	routes.RegisterUser(context, r)
	routes.RegisterResources(context, r)

	http.Handle("/", handlers.CORS()(r))

	port := os.Getenv("EXTRA_PORT")
	if port == "" {
		port = "0"
	}

	listener, err := net.Listen("tcp", ":"+port)
	if err != nil {
		panic(err)
	}

	log.Println(fmt.Sprintf("extra listening at http://localhost:%d", listener.Addr().(*net.TCPAddr).Port))
	panic(http.Serve(listener, nil))
}

func (pluginDemo *ExtraPlugin) GetMetadata() plugin.PluginMetadata {
	return plugin.PluginMetadata{
		Name: "extra",
		Version: plugin.VersionType{
			Major: 0,
			Minor: 0,
			Build: 1,
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
