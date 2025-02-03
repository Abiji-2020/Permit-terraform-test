const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

const TF_FILE = path.join(__dirname, "temp/config.tf");
const generateTfFile = (data, apiKey) => {
  // Start the Terraform configuration
  let tfContent = `
terraform {
  required_providers {
    permitio = {
      source = "registry.terraform.io/permitio/permit-io"
    }
  }
}

provider "permitio" {
  api_key = "${apiKey}"
}

`;

  // Loop through resources and generate their block in the Terraform file
  data.resources.forEach((resource) => {
    tfContent += `
resource "${resource.type}" "${resource.key}" {
  key = "${resource.key}"
  name = "${resource.name}"
  
  // Handle actions if present
  ${resource.actions ? `actions = {
    ${Object.entries(resource.actions).map(([key, value]) => `
      "${key}" = {
        "name" = "${value.name}"
      }
    `).join("\n")}
  }` : ''}
  
  // Default empty attributes block
  attributes = {}
}
    `;
  });

  // Write the generated content to the temp/config.tf file
  fs.writeFileSync(TF_FILE, tfContent, "utf-8");
};
app.post("/apply", (req, res) => {
  try {
    const apiKey = req.headers['authorization'];
    if (!apiKey) {
      return res
        .status(400)
        .json({ error: "ApiKey is required to apply the terraform file" });
    }
    generateTfFile(req.body, apiKey);
    exec(
      "terraform init && terraform apply -auto-approve",
      { cwd: __dirname+"/temp"},
      (error, stdout, stderr) => {
        if (error) {
          return res.status(500).json({ error: stderr || error.message });
        }
        res.json({ message: "Terraform successful", output: stdout });
      },
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = 3456;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
