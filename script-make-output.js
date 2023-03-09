var firstTime = true;
function makeOutput(values) {
  writetext(values);
  drawchart(values);
  maketable(values);
  if (firstTime) {
    document.getElementById("clicktorun").remove();
    firstTime = false;
  }
}
function writetext(values) {
  var bouncetext = "";
  var bounce = values.slacker.b > 0;
  var heavysetup = values.setupWeight > values.slacker.w / 2;
  var leashfalldistancepara = "";
  if (values.fallpoint[3] - values.slacker.l <= 0) {
    leashfalldistancepara = `<p class="smallspace danger"><b> Warning </b> A leashfall would hit the ground!</p>`;
  }
  var backupfalltext = `<p class="smallspace info">
  There was no mainline segment selected to break in the simulation. Choose at least one to simulate a backup fall.
  </p>`;
  if (values.backupFall) {
    var backupfalldistancepara = "";
    if (values.backupFallpoint[3] - values.slacker.l <= 0) {
      backupfalldistancepara = `<p class="smallspace danger"><b> Warning </b> A backupfall would hit the ground!</p>`;
    }
    backupfalltext = `<h2 class="bigspace">Backup fall</h3>
    <p class="smallspace">
      This is a <b>worst case senario backup-fall</b>${
        bounce ? " from the top of the bounce" : ""
      }. 
      It depends on the pieces of mainline you have selected to break.
    </p>
  <p class="smallspace">
    The <b>peak tension</b> is ${values.F1max.toFixed(
      2
    )} kN on the left side and ${values.F2max.toFixed(2)} kN on the right side.
    </p>
  <p class="smallspace">
    <b>In the leash</b> and the slackliner's body, the peak tension is ${values.FleashMax.toFixed(
      2
    )} kN, equivalent to ${((values.FleashMax * 1000) / 9.81).toFixed(2)} kg.
  </p>
  <p class="smallspace">
    The <b>lowest height</b> reached by the slackliner is ${(
      values.backupFallpoint[3] - values.slacker.l
    ).toFixed(2)} m, 
    falling a total distance of ${(
      values.balancepoint[1] -
      values.backupFallpoint[3] +
      values.slacker.l +
      values.slacker.h / 2
    ).toFixed(2)} m.
  </p>
  ${
    values.backuptightbackup
      ? '<div class="smallspace warning"> At least one other section of backup is getting engaged in the backupfall</div>'
      : ""
  }
  <p class="smallspace">
    After the fall has settled, the tension is ${values.F1after.toFixed(
      2
    )} kN on the left side,
    and ${values.F2after.toFixed(2)} kN on the right side.
  </p>
  <p class="smallspace">
    The final height of slackliner hanging from the line is ${(
      values.backupFallpoint[1] - values.slacker.l
    ).toFixed(2)} m, 
    who is ${values.backupFallpoint[0].toFixed(2)} m from the first anchor.
  </p>
  ${backupfalldistancepara}`;
  }
  if (bounce) {
    bouncetext = `<p class="smallspace">
    At the bottom of the bounce of amplitude ${
      2 * values.slacker.b
    } meters, the tension is 
    ${values.F1bounce.toFixed(
      2
    )} kN on the left side and ${values.F2bounce.toFixed(2)} kN
    on the right side:
    </p>`;
    if (values.backuptightbounce) {
      bouncetext += `
        <div class="smallspace warning"> At least one section of backup is getting engaged in the bounce</div>
      `;
    }
  }

  document.getElementById("textResult").innerHTML =
    `
  ${
    heavysetup
      ? `<div class="smallspace danger"> 
  The setup is <b>heavy</b> compared to the slacker, the results will be less accurate.`
      : `<div class="smallspace">`
  }
     The setup weights ${values.setupWeight.toFixed(2)} kg.
    </div>
    <h1 class="smallspace"> How to read these numbers? </h1>
    <h2 class="bigspace">Initial position</h2>
  <p class="smallspace">
    The <b>tension</b> with the slackliner on the line is ${values.F1balance.toFixed(
      2
    )} kN
    on the left side and ${values.F2balance.toFixed(2)} kN on the right side.
  </p>
  <p class="smallspace">
    The <b>height</b> of the line with the slackliner is ${values.balancepoint[1].toFixed(
      2
    )} m,
    who is ${values.balancepoint[0].toFixed(2)} m from the first anchor.
  </p>
  ${
    values.backuptightbalance
      ? '<div class="smallspace warning"> At least one section of backup is engaged when the slackliner is on the line</div>'
      : ""
  }
  ${bouncetext}
  <h2 class="bigspace">Leashfall${
    bounce ? " from the top of the bounce" : ""
  }</h3>
  <p class="smallspace">
    The <b>peak tension</b> in a leash fall is ${values.F1fall.toFixed(
      2
    )} kN on the left side and ${values.F2fall.toFixed(2)} kN on the right side.
  </p>
  <p class="smallspace">
    <b>In the leash</b> and the slackliner's body, the peak tension is ${values.FleashFall.toFixed(
      2
    )} kN, equivalent to ${((values.FleashFall * 1000) / 9.81).toFixed(2)} kg
  </p>
  <p class="smallspace"> 
    The <b>lowest height</b> reached by the slackliner is ${(
      values.fallpoint[3] - values.slacker.l
    ).toFixed(2)} m, 
    falling a total distance of ${(
      values.balancepoint[1] -
      values.fallpoint[3] +
      values.slacker.l +
      values.slacker.h / 2
    ).toFixed(2)} m.
  </p>
  ${
    values.backuptightfall
      ? '<div class="smallspace warning"> At least one section of backup is engaged in the leashfall</div>'
      : ""
  }
  ` +
    leashfalldistancepara +
    backupfalltext;
}
function maketable(values) {
  var bounce = values.slacker.b > 0;
  document.getElementById("tableResult").innerHTML = `
        <table class="table center">
          <thead>
            <tr>
              <th scope="col">Situation</th>
              <th scope="col">Slackliner's height (m)</th>
              <th scope="col">Distance from anchor</th>
              <th scope="col">Tension - left side (kN)</th>
              <th scope="col">Tension - right side (kN)</th>
              <th scope="col">Tension - leash (kN)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Walking</td>
              <td>${values.balancepoint[1].toFixed(2)}</td>
              <td>${values.balancepoint[0].toFixed(2)}</td>
              <td>${values.F1balance.toFixed(2)}</td>
              <td>${values.F2balance.toFixed(2)}</td>
              <td> - </td>
            </tr>
            ${
              bounce
                ? `<tr>
              <td>Bouncing</td>
              <td>${(values.balancepoint[1] - values.slacker.b).toFixed(2)}</td>
              <td>${values.balancepoint[0].toFixed(2)}</td>
              <td>${values.F1bounce.toFixed(2)}</td>
              <td>${values.F2bounce.toFixed(2)}</td>
              <td> - </td>
            </tr>`
                : ""
            } 
            <tr>
              <td>Leash fall</td>
              <td>${(values.fallpoint[3] - values.slacker.l).toFixed(2)}</td>
              <td>${values.fallpoint[2].toFixed(2)}</td>
              <td>${values.F1fall.toFixed(2)}</td>
              <td>${values.F2fall.toFixed(2)}</td>
              <td>${values.FleashFall.toFixed(2)}</td>
            </tr>
            ${
              values.backupFall
                ? `
            <tr>
              <td>Backup fall - impact</td>
              <td>${(values.backupFallpoint[3] - values.slacker.l).toFixed(
                2
              )}</td>
              <td>${values.backupFallpoint[2].toFixed(2)}</td>
              <td>${values.F1max.toFixed(2)}</td>
              <td>${values.F2max.toFixed(2)}</td>
              <td>${values.FleashMax.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Backup fall - settled</td>
              <td>${(values.backupFallpoint[1] - values.slacker.l).toFixed(
                2
              )}</td>
              <td>${values.backupFallpoint[0].toFixed(2)}</td>
              <td>${values.F1after.toFixed(2)}</td>
              <td>${values.F2after.toFixed(2)}</td>
              <td> - </td>
            </tr>
            `
                : ``
            }
          </tbody>
        </table>
  `;
}
var chart;
function drawchart(values) {
  var images = ["./assets/walking.png", "./assets/hanging.png"];
  var points = computeLines(
    0,
    values.spot.L,
    values.spot.h1,
    values.spot.h2,
    values.balancepoint[0],
    values.balancepoint[1],
    values.fallpoint[2],
    values.fallpoint[3],
    "walk"
  );
  var data = [
    {
      type: "rangeArea",
      showInLegend: true,
      name: "Leashfall",
      markerSize: 0,
      dataPoints: points,
    },
  ];
  if (values.backupFall) {
    var backupPoints = computeLines(
      0,
      values.spot.L,
      values.spot.h1,
      values.spot.h2,
      values.backupFallpoint[0],
      values.backupFallpoint[1],
      values.backupFallpoint[2],
      values.backupFallpoint[3],
      "backupfall"
    );
    data.push({
      type: "rangeArea",
      showInLegend: true,
      name: "Backup Fall",
      markerSize: 0,
      lineColor: "#C0504E",
      color: "#C0504E",
      dataPoints: backupPoints,
    });
  }
  chart = new CanvasJS.Chart("graphs", {
    exportEnabled: false,
    animationEnabled: false,
    theme: "light2",
    title: {
      text: "Highline modelisation",
    },
    axisX: {},
    axisY: {
      suffix: " m",
    },
    toolTip: { enabled: false },
    legend: {
      horizontalAlign: "right",
      itemclick: toggleDataSeries,
    },
    data: data,
    plugins: [
      {
        afterDraw: (chart) => {
          var ctx = chart.chart.ctx;
          var xAxis = chart.scales["x-axis-0"];
          var yAxis = chart.scales["y-axis-0"];
          var x = xAxis.getPixelForValue(values.balancepoint[0]);
          var y = yAxis.getPixelForValue(values.balancepoint[0]);
          console.log(x, y);
          ctx.drawImage(images[0], x + 12, y + 20);
        },
      },
    ],
  });
  chart.render();

  function toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  }

  addImages(images, values);
}
function computeLines(x0, xf, y0, yf, x, y, xx, yy, label) {
  var points = [];
  if (x == xx) {
    points = [
      { x: x0, y: [y0, y0] },
      { x: x, y: [y, yy], label: label },
      { x: xf, y: [yf, yf] },
    ];
  }
  if (x < xx) {
    points = [
      { x: x0, y: [y0, y0] },
      { x: x, y: [y, y0 + (x * (yy - y0)) / xx], label: label },
      { x: xx, y: [yf + ((xf - xx) * (y - yf)) / (xf - x), yy], label: label },
      { x: xf, y: [yf, yf] },
    ];
  }
  if (x > xx) {
    points = [
      { x: x0, y: [y0, y0] },
      { x: xx, y: [y0 + (xx * (y - y0)) / x, yy], label: label },
      { x: x, y: [y, yf + ((xf - x) * (yy - yf)) / (xf - xx)], label: label },
      { x: xf, y: [yf, yf] },
    ];
  }
  return points;
}
var imagedata = [];
function addImages(images, values) {
  var imageLabel = $("<img>")
    .attr("src", images[0])
    .attr("class", chart.data[0].dataPoints[1].label)
    .css("display", "none")
    .appendTo($("#graphs>.canvasjs-chart-container"));
  imagedata.push({
    img: imageLabel,
    x: values.balancepoint[0],
    y: values.balancepoint[1],
    up: 1,
  });
  var index = values.backupFall ? 1 : 0;
  var imageLabel2 = $("<img>")
    .attr("src", images[1])
    .attr("class", chart.data[index].dataPoints[1].label)
    .css("display", "none")
    .appendTo($("#graphs>.canvasjs-chart-container"));
  imagedata.push({
    img: imageLabel2,
    x: values.backupFallpoint[2],
    y: values.backupFallpoint[3],
    up: 0,
  });
  for (var i = 0; i < imagedata.length; i++) {
    positionImage(
      imagedata[i].img,
      imagedata[i].x,
      imagedata[i].y,
      imagedata[i].up
    );
  }
}

function positionImage(imageLabel, x, y, up) {
  var imageBottom = chart.axisY[0].convertValueToPixel(y).toFixed(0);
  var imageCenter = chart.axisX[0].convertValueToPixel(x).toFixed(0);
  imageLabel.width("35px");
  imageLabel.height("50px");
  imageLabel.css({
    position: "absolute",
    display: "block",
    top: imageBottom - up * 50 + "px",
    left: imageCenter - 13 + "px",
  });
  chart.render();
}
window.onresize = function () {
  for (var i = 0; i < imagedata.length; i++) {
    positionImage(
      imagedata[i].img,
      imagedata[i].x,
      imagedata[i].y,
      imagedata[i].up
    );
  }
};
