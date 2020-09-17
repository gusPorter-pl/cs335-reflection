const getData = (type) => {
   const dataPromise = fetch(
      "https://api.thevirustracker.com/free-api?countryTimeline=NZ",
      {
         headers: {
            Accept: "application/json"
         }
      }
   );
   const stream = dataPromise.then((response) => response.json());
   stream.then((data) => {
      /**
       * new_daily_cases
       * new_daily_deaths
       * total_cases
       * total_deaths
       */
      const timeline = data.timelineitems[0];
      if (timeline.stat) {
         delete timeline.stat;
      }
      const dates = Object.keys(timeline);
      dates.sort((a, b) => (a > b ? 1 : -1));

      const caseHeader = document.getElementById("case-header");
      const readableType = snakeCaseToReadable(type);
      caseHeader.innerHTML = readableType;

      const caseDiv = document.getElementById("case-div");
      caseDiv.innerHTML = "";

      let totalBoolean = false;
      if (readableType.split(" ").length === 1) {
         totalBoolean = true;
         type += "_cases";
      }
      let biggestValue = 0;
      dates.forEach((date) => {
         if (timeline[date][type] > biggestValue) {
            biggestValue = timeline[date][type];
         }
      });

      const axis = document.createElement("div");
      axis.style = "float: left;";

      const topAxis = document.createElement("div");
      topAxis.style = "margin-right: 10px";
      topAxis.innerHTML = biggestValue;
      caseDiv.appendChild(topAxis);

      const bottomAxis = document.createElement("div");
      bottomAxis.style = "padding-top: 635px; margin-right: 10px";
      bottomAxis.innerHTML = "0";

      axis.appendChild(topAxis);
      axis.appendChild(bottomAxis);
      caseDiv.appendChild(axis);

      const modifier = 330 / biggestValue;
      biggestValue *= modifier;

      dates.forEach((date) => {
         const dateList = date.split("/");
         const month = dateList[0];
         const day = dateList[1];
         let height, whiteHeight, deathHeight;
         if (totalBoolean) {
            const deathType = type.slice(0, type.length - 5) + "deaths";
            deathHeight = timeline[date][deathType] * 2 * modifier;
            height = timeline[date][type] * 2 * modifier - deathHeight;
            if (timeline[date][type] > 0) {
               whiteHeight = biggestValue * 2 - (height + deathHeight);
            } else {
               whiteHeight = biggestValue * 2 - deathHeight;
            }
         } else {
            height = timeline[date][type] * 2 * modifier;
            whiteHeight = biggestValue * 2 - height;
         }

         const line = document.createElement("div");
         const white = document.createElement("div");
         white.style =
            "border-left: 3px solid white; width: 2px; height: " +
            whiteHeight +
            "px;";
         const colour = document.createElement("div");
         const typeArray = type.split("_");
         const lineColour =
            typeArray[typeArray.length - 1] == "cases" ? "green" : "#fbd448";
         colour.style =
            "border-left: 3px solid " +
            lineColour +
            "; width: 2px; height: " +
            height +
            "px;";

         line.style = "float: left;";

         line.appendChild(white);
         line.appendChild(colour);
         if (totalBoolean) {
            const death = document.createElement("div");
            death.style =
               "border-left: 3px solid #fbd448; width: 2px; height: " +
               deathHeight +
               "px;";
            line.appendChild(death);
         }

         if (day == 1) {
            const monthDisplay = document.createElement("div");
            monthDisplay.style =
               "position: absolute; transform: rotate(45deg); translate(0%, 50%); transform-origin: left;";
            monthDisplay.innerHTML = numberToMonth(month);
            line.appendChild(monthDisplay);
         }

         caseDiv.appendChild(line);
      });
   });
};

const snakeCaseToReadable = (text) => {
   const textList = text.split("_");
   let newText = "";
   textList.forEach((item) => {
      if (item === "new") {
         return;
      }
      newText +=
         item.charAt(0).toUpperCase() + item.slice(1, item.length) + " ";
   });
   return newText.slice(0, newText.length - 1);
};

const numberToMonth = (number) => {
   switch (number) {
      case "1":
         return "January";
      case "2":
         return "February";
      case "3":
         return "March";
      case "4":
         return "April";
      case "5":
         return "May";
      case "6":
         return "June";
      case "7":
         return "July";
      case "8":
         return "August";
      case "9":
         return "September";
      case "10":
         return "October";
      case "11":
         return "November";
      case "12":
         return "December";
      default:
         return "illegal month number";
   }
};

window.onload = () => {
   getData("new_daily_cases");
};
