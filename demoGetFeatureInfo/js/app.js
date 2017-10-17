const host = 'http://127.0.0.1:8002/geocure';


window.onload = function() {

  // Getting the width and height of the canvas. Used for requesting the image and the feature info.
  let canvasheight = $('#mapCanvas').attr('height');
  let canvaswidth = $('#mapCanvas').attr('width');

  let dataURL = host + '/services/colabis-geoserver/map/render?layer=ckan:_53fbae20_e2fb_4fd1_b5d6_c798e11b96d1&width=' + canvaswidth + '&height=' + canvasheight;

  getAvailableMaps().then(addMapsToSelectOptions).then(addEventlistenerToSelect)

  loadCanvas(dataURL);

  function loadCanvas(dataURL) {
    var canvas = document.getElementById('mapCanvas');
    var context = canvas.getContext('2d');

    // load image from data url
    var imageObj = new Image();
    imageObj.onload = function() {
      context.drawImage(this, 0, 0);
    };
    imageObj.src = dataURL;
  }



  $('#mapCanvas').on('click', function(event) {
    console.log('Canvas click');
    var x = event.offsetX;
    var y = event.offsetY;

    let size = '&height=' + $('#mapCanvas').attr('height') + '&width=' + $('#mapCanvas').attr('width');
    let requestUrl = host + '/services/colabis-geoserver/map/info?layer=ckan:_53fbae20_e2fb_4fd1_b5d6_c798e11b96d1&x=' + x + '&y=' + y + size;
    console.log("meta");
    console.log(requestUrl);
    $.get(requestUrl, function(res) {
      $('#json').empty();
      $('#json').append(JSON.stringify(res.features[0].properties.typed_name, null, 2));
      $('#myModal').modal();
    });

  });
}


function getAvailableMaps() {
  return new Promise((resolve, reject) => {
    try {
      let availableMaps = host + '/services/colabis-geoserver/map'
      $.get(availableMaps, availaleMaps => {
        resolve(availaleMaps);
      }).fail(() => {
        throw "Error in requesting available maps."
      })
    }
    catch(error) {
      reject(error)
    }
  });
};

function addMapsToSelectOptions(availaleMaps) {
  return new Promise((resolve, reject) => {
    try {
      let map = availaleMaps.layers;

      for(let i = 0; i <= map.length; i++) {
        if(i == map.length) {
          resolve();
          return;
        }
        else {
          let option = $('<option>').text(map[i].title).attr('href', map[i].href);
          console.log(option);
          $('#availableMaps').append(option).selectpicker('refresh');
        }
      }
    }
    catch(error) {
      reject(error);
    }
  });
};

function addEventlistenerToSelect() {
  return new Promise((resolve, reject) => {
    try {
      $('#availableMaps').change(function(){
        let linkToMap = $( "#availableMaps option:selected" ).attr('href');
        reloadMapOnCanvas(linkToMap).then(updateOnClickCanvasEvent);

      })
    }
    catch(error) {
      reject(error);
    }
  });
};


function reloadMapOnCanvas(linkToMap) {
  return new Promise((resolve, reject) => {
    try {
      let size = '&height=' + $('#mapCanvas').attr('height') + '&width=' + $('#mapCanvas').attr('width');
      let imageRequestURL = linkToMap + size;
      var canvas =document.getElementById('mapCanvas');
      var context = canvas.getContext('2d');

      // load image from data url
      var imageObj = new Image();
      imageObj.onload = function() {
        context.drawImage(this, 0, 0);
        resolve({url: linkToMap, size: size});
      };
      imageObj.src = imageRequestURL;

    }
    catch(error) {
      reject(error);
    }
  });
};

function updateOnClickCanvasEvent(imageRequestURL) {
  return new Promise((resolve, reject) => {
    try {
      console.log(imageRequestURL)
      const basisInfoURl = '/services/colabis-geoserver/map/info?';
      let currentLayer = imageRequestURL.url.match(/layer=.*[^\/]/);
      let size = imageRequestURL.size;


      $('#mapCanvas').off() // Remove all eventlisteners, added with .on

      $('#mapCanvas').on('click', function(event) {
        console.log('Canvas click');
        var x = event.offsetX;
        var y = event.offsetY;

        let requestUrl = host + basisInfoURl + currentLayer + size + '&x=' + x + '&y=' + y;
        console.log("meta");
        console.log(requestUrl);
        $.get(requestUrl, function(res) {
          $('#json').empty();
          $('#json').append(JSON.stringify(res, null, 2));
          $('#myModal').modal();
        });
      });

      resolve();

    }
    catch(error) {
      reject(error);
    }
  });
}
