terraform{
        required_providers {
            permitio = {
                source = "registry.terraform.io/permitio/permit-io"
            }
        }
    }

    provider "permitio" {
        api_key = "permit_key_9ocruZlZrwCCXDQIaqMgqkhxBOPYrJMXDIKsKdleRaibKEK280D8tadf88xcT9ToUKFbEhtUdS86wLhPzg0EKp"
    }resource "permitio_resource" "file" {
            key = "file"
            name = "file"    
         actions = {
              "create = {
                "name" = "Create"
            }      "read = {
                "name" = "Read"
            }      "update = {
                "name" = "Update"
            }      "delete = {
                "name" = "Delete"
            } }
 attributes = {}
}resource "permitio_resource" "folder" {
            key = "folder"
            name = "folder"    
         actions = {
              "create = {
                "name" = "Create"
            }      "list = {
                "name" = "List"
            }      "modify = {
                "name" = "Modify"
            }      "delete = {
                "name" = "Delete"
            } }
 attributes = {}
}