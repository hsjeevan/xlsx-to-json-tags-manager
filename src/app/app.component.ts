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
  trigger() {
    for (let obj of this.jsData.Sheet1) {
      // console.log(obj);
      if (typeof this.tagsObject[obj["TAG Category"]] === "undefined")
        this.tagsObject[obj["TAG Category"]] = new Array();
      this.tagsObject[obj["TAG Category"]].push(obj);
    }
    console.log(this.tagsObject);
  }

  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector("#download");
      el.setAttribute(
        "href",
        `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.tagsObject))}`
      );
      el.setAttribute("download", "xlsxtojson.json");
    }, 1000);
  }
}
