import { Component } from "@angular/core";
import * as XLSX from "xlsx";

export interface tagData {
  Attribute: string;
  Description: string;
  TAG: string;
  "TAG Category": string;
  "TAG Group": string;
}
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  willDownload = false;

  constructor() {}
  jsData: any;

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = event => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: "binary" });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.jsData = jsonData;
      this.trigger();

      const dataString = JSON.stringify(jsonData);
      document.getElementById("output").innerHTML = dataString
        .slice(0, 300)
        .concat("...");
      this.setDownload(dataString);
    };
    reader.readAsBinaryString(file);
  }

  tagsObject: any = {};
  tagGroupsObject: any = {};

  trigger() {
    for (let obj of this.jsData.Sheet2) {
      console.log(obj);
      if (typeof this.tagsObject[obj["TAG Category"]] === "undefined")
        this.tagsObject[obj["TAG Category"]] = new Array();
      this.tagsObject[obj["TAG Category"]].push(obj);

      // if (typeof this.tagGroupsObject[obj["TAG Group"]] === "undefined")
      //   this.tagGroupsObject[obj["TAG Group"]] = new Array();
      // this.tagGroupsObject[obj["TAG Group"]].indexOf(obj["TAG Category"]) === -1
      //   ? this.tagGroupsObject[obj["TAG Group"]].push(obj["TAG Category"])
      //   : console.log("This item already exists");

      console.log(this.tagsObject);
      console.log(this.tagGroupsObject);
    }
  }

  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector("#download");
      el.setAttribute(
        "href",
        `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(this.tagsObject)
        )}`
        // `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.tagGroupsObject))}`
      );
      el.setAttribute("download", "xlsxtojson.json");
    }, 1000);
  }
}
