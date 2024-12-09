sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("docect.controller.View1", {
            onInit: function () {

            },
            onAfterRendering: function () {
                var oData = {
                    "Fileid": ""
                };

                var ViewModel = new sap.ui.model.json.JSONModel(oData);
                this.getView().setModel(ViewModel, "DocExt");
            },
            ontest: function () {
                this.getView().getModel().read("/jobs", {

                    success: function (oData, oResponse) {
                        debugger
                    }.bind(this),
                    error: function (oError) {
                        debugger
                        // MessageBox.error(oError.message);
                    }
                });
            },
            onPost: function (formData) {
                // var obj = {
                //     clientId: "default"
                // };
                var omodel = this.getView().getModel();
                // var headers = {
                //     'content-type': "multipart/form-data",
                //     'Accept': 'multipart/mixed'
                // };
                // omodel.setHeaders(headers);
                // omodel.create("/jobs", formData, {

                //     success: function (oData, oResponse) {
                //         if (oData.id) {
                //             MessageBox.success("File uploaded successfully.");
                //             this.getView().getModel("DocExt").setProperty("/Fileid", oData.id);
                //             this.getView().byId("fileUploader").setValue("")
                //         }
                //         debugger
                //     }.bind(this),
                //     error: function (oError) {
                //         debugger
                //         // MessageBox.error(oError.message);
                //     }
                // });

                $.ajax({
                    url: "/odata/v2/CatalogService/jobs",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response){
                    debugger // Handle success response
                    },
                    error: function(xhr, textStatus, error){
                        debugger  // Handle error response
                    }
                });
            },
            onFileUploaderChange: function () {
                const oFileUploader = this.getView().byId("fileUploader")

                const oUploadedFile = oFileUploader.oFileUpload.files[0]

                const blob = new Blob([oUploadedFile], { type: oUploadedFile.type })
                const formData = new FormData()
                formData.append("file", blob, oUploadedFile.name)
             
                var options = {
                    "clientId": "default",
                    "extraction": {
                        "headerFields": [
                            "documentNumber",
                            "grossAmount"
                        ]
                    },
                    "documentType": "invoice"
                }
                formData.append('options', JSON.stringify(options));

                this.onPost(formData);
            }
        });
    });
