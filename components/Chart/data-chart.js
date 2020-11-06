let colors = {
  gray: {
    100: "#f6f9fc",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#8898aa",
    700: "#525f7f",
    800: "#32325d",
    900: "#212529"
  },
  theme: {
    default: "#172b4d",
    primary: "#ff4d4f",
    // primary: "#5e72e4",
    secondary: "#f4f5f7",
    info: "#11cdef",
    success: "#2dce89",
    danger: "#f5365c",
    warning: "#fb6340"
  },
  black: "#12263F",
  white: "#FFFFFF",
  transparent: "transparent"
};

export let options = {
  scales: {
    yAxes: [
      {
        gridLines: {
          color: colors.gray[400],
          zeroLineColor: colors.gray[400]
        },
        ticks: {
          callback: function(value) {
            if (!(value % 2)) {
              return value;
            }
          }
        }
      }
    ]
  },
  tooltips: {
    backgroundColor: "#6c757d",
    callbacks: {
      label: function(item, data) {
        var label = data.datasets[item.datasetIndex].label || "";
        var yLabel = item.yLabel;
        var content = "";

        if (data.datasets.length > 1) {
          content += label;
        }

        content += yLabel;
        return content;
      }
    }
  }
};
