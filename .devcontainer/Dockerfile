from hashicorp/terraform:latest

run apk add --no-cache \ 
    nginx \ 
    npm \
    go

workdir /workspace
run git clone https://github.com/permitio/terraform-provider-permit-io

