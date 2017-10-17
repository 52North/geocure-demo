window.onload = function() {
  loadCanvas();

  function loadCanvas(dataURL) {
    var canvas = document.getElementById('mapCanvas');
    var context = canvas.getContext('2d');

    // load image from data url
    var imageObj = new Image();
    imageObj.onload = function() {
      context.drawImage(this, 0, 0);
    };
    console.log("nod adding image src");
    let imageURL = 'https://www.google.de/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiEh6GWpPfWAhUCblAKHSjYBhUQjRwIBw&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FPortable_Network_Graphics&psig=AOvVaw3VSmvhlFDlTLI4n9aSGAXW&ust=1508316814380003'
    let url = 'http://127.0.0.1:8002/geocure/services/colabis-geoserver/map/render?layer=ckan:_53fbae20_e2fb_4fd1_b5d6_c798e11b96d1';
    imageObj.src = imageURL;

  }

  $('#mapCanvas').on('click', function(event) {
    console.log("adding click event");
    var x = event.offsetX;
    var y = event.offsetY;

    let requestUrl = 'http://127.0.0.1:8002/geocure/services/colabis-geoserver/map/info?layer=ckan:_53fbae20_e2fb_4fd1_b5d6_c798e11b96d1&x=' + x + '&y=' + y;

    $.get(requestUrl, function(res) {
      $('#json').empty();
      $('#json').append(JSON.stringify(res.features[0].properties.typed_name, null, 2));
      $('#myModal').modal();
    });

  });

}
