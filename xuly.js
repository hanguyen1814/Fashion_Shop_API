const fs = require("fs");
const path = require("path");

// Load JSON data
const data = require("./data.json");

// Define the output file path
const outputFilePath = path.join(__dirname, "output.txt");

// Define the fields to extract
const fields = [
  "itemid",
  "catid",
  "brand",
  "name",
  "description",
  "price",
  "price_before_discount",
  "raw_discount",
  "stock",
  "sold",
  "image",
  "images",
];

// Define the image URL prefix
const imageUrlPrefix = "https://down-vn.img.susercontent.com/file/";

// Process data and convert to text format
const outputData = data
  .map((item) => {
    return fields
      .map((field) => {
        if (field === "images") {
          return item[field]
            ? item[field].map((img) => imageUrlPrefix + img).join(",")
            : "";
        }
        if (field === "image") {
          return item[field] ? imageUrlPrefix + item[field] : "";
        }
        if (field === "price" || field === "price_before_discount") {
          return item[field] !== undefined ? item[field] / 100000 : "";
        }
        return item[field] !== undefined ? item[field] : "";
      })
      .join("|");
  })
  .join("\n");

// Write the output data to a text file
fs.writeFileSync(outputFilePath, outputData, "utf8");

console.log("Data has been processed and saved to output.txt");
