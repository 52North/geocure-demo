const host = 'http://127.0.0.1:8002/geocure';


window.onload = function() {

  getAvailableMaps()
    .then(addMapsToSelectOptions)
    .then(addEventlistenerToSelect);
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
        let linkToMap = $("#availableMaps option:selected").attr('href');
        if(linkToMap){
          reloadMapOnCanvas(linkToMap).then(updateOnClickCanvasEvent).then(resolve);
        }
        resolve()
      });
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

      const basisInfoURl = '/services/colabis-geoserver/map/info?';
      let currentLayer = imageRequestURL.url.match(/layer=.*[^\/]/);
      let size = imageRequestURL.size;


      $('#mapCanvas').off() // Remove all eventlisteners, added with .on

      $('#mapCanvas').on('click', function(event) {

        var x = event.offsetX;
        var y = event.offsetY;

        let requestUrl = host + basisInfoURl + currentLayer + size + '&x=' + x + '&y=' + y;

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
