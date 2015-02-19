var mode = 0;
var expanded = false;
var exit = false;
var images = "";

$(document).ready( function () {
  $(window).resize(updateSizes());
  window.onresize = updateSizes;
  updateSizes();

  $('#log').hide();
  $('#mapDiv').css({left: window.innerWidth + 10});
  $('#imagesDiv').css({left: (window.innerWidth * 2) + 10});
  $('#imagesDiv').css({width: window.innerWidth - 20, top: 60, bottom: 10});

  var i = 1;
  var nextImage = "image" + i + ".jpg";
  checkImage(nextImage);
  function checkImage(src) {
    var img = new Image();
    img.onload = function() {
        // code to set the src on success
        console.log(i);
        images += "<img id=\"" + i + "\" src=\"" + src + "\"></img>";
        i++;
        var nextImage = "image" + i + ".jpg";
        checkImage(nextImage)
    };
    img.onerror = function() {
      // doesn't exist or error loading
      console.log("exiting");
      console.log(images);
      $('#imagesContainer').html(images);
    };
    img.src = src; // fires off loading of image
  }

  $('#joystickBubble').draggable();
  $('#joystickBubble').mouseup(function() {
    $(this).css({ transition: '1s'});
    $(this).css({left: 75, top: 125});
    setTimeout( function() {$('#joystickBubble').css({ transition: 'none' });console.log("back");} , 1000);
  });

  $('#focusBubble').draggable({ axis: "x", containment: 'parent' });
  $('#focusBubble').mousedown(function() {
    console.log("down");
  });

  $('#captureButton').click(function() {
    var extraSpace = window.innerWidth - 220;

    if (((extraSpace * 0.643) + 80) < window.innerHeight) {
      $('#videoDiv').animate({left: 10});
    } else {
      extraSpace = window.innerWidth - 200 - $("#videoDiv").width();
      $('#videoDiv').animate({left: (extraSpace / 2) + 10});
      $("#controlDiv").animate({right: (extraSpace / 2)});
    }
    $('#mapDiv').animate({left: window.innerWidth + 10});
    $('#imagesDiv').animate({left: (window.innerWidth * 2) + 10});
    $('#controlDiv').animate({right: 10});
    mode = 5;
    updateSizes();
    setTimeout(function() {
      mode = 0;
      updateSizes();
    }, 500);
  });
  $('#mapButton').click(function() {
    var extraSpace = window.innerWidth - 544;
    $('#mapDiv').animate({left: (extraSpace/2)});
    $('#videoDiv').animate({left: 0 - (window.innerWidth + 10)});
    $('#imagesDiv').animate({left: (window.innerWidth) + 10});
    $('#controlDiv').animate({right: 10});
    mode = 1;
    setTimeout(function() {updateSizes();}, 500);
  });
  $('#imagesButton').click(function() {
    $('#mapDiv').animate({left: 0 - (window.innerWidth + 10)});
    $('#videoDiv').animate({left: 0 - ((window.innerWidth * 2) + 10)});
    $('#imagesDiv').animate({left: 10});
    $('#controlDiv').animate({right: (window.innerWidth + 10)});
    mode = 2;
    setTimeout(function() {updateSizes();}, 500);
  });

  $("#imagesContainer").on('click', 'img', function() {
    console.log("clicked");
    if (expanded == false) {
      var width = ($("#imagesDiv").height() - 20) * 1.3333;
      var height = $("#imagesDiv").height() - 20;
      var extraSpace = (window.innerWidth - width)/2;
      $('#imagesContainer').animate({width: $('#imagesContainer').children().length * (width + 20)});
      $('#imagesContainer').children().animate({width: width, height: height});
      $('#imagesDiv').animate({scrollLeft: (($(this).attr('id')-1) * (width + 20)) - extraSpace});
      console.log(('#imagesContainer img').length);
      expanded = true;
    }
    else {
      $('#imagesContainer').animate({width: '100%'});
      $('#imagesContainer').children().animate({width: 133, height: 100});
      $('#imagesDiv').animate({scrollLeft: 0});
      expanded = false;
    }
  });
  // $bubble.mousemove(function(event) {
  //   console.log("x: " + event.pageX + "\ty: " + event.pageY);
  //   $(this).css({left: event.pageX, top: event.pageY, 'background-color': "green"});
  // });
});

function updateSizes() {
  if (mode == 0 || mode == 5) {
    var extraSpace = window.innerWidth - 220;

    if (((extraSpace * 0.643) + 80) < window.innerHeight) {
      $("#videoDiv").css({width: extraSpace, height: (extraSpace * 0.643)});
      if (mode == 0) { $("#videoDiv").css({left: 10}); $("#controlDiv").css({right: 10});}
      $("#videoDiv iframe").width(extraSpace);
      $("#videoDiv iframe").height(extraSpace * 0.5294);

    }
    else {
      extraSpace = window.innerWidth - 200 - $("#videoDiv iframe").width();
      $("#videoDiv").css({height: window.innerHeight - 80, width: (window.innerHeight - 60) * 1.554});
      if (mode == 0) { $("#videoDiv").css({left: ((extraSpace / 2) + 10)}); $("#controlDiv").css({right: (extraSpace / 2)});}

      $("#videoDiv iframe").width((window.innerHeight - 60) * 1.554);
      $("#videoDiv iframe").height($("#videoDiv iframe").width() * 0.5294);
    }
    $("#mapDiv").css({left: window.innerWidth + 10});
  }
  else if (mode == 1){
    var extraSpace = window.innerWidth - 544;
    $('#mapDiv').css({left: (extraSpace/2)});
  }
  else if (mode == 2) {
    $('#imagesDiv').css({left: 10, width: window.innerWidth - 20, top: 60, bottom: 10});
    $('#controlDiv').css({right: (window.innerWidth + 10)});
  }

}

/*
var i = 0;
while (true) {
  try {
    downloadFile('192.168.42.1/images/image' + i + '.png', function(blob) {
        saveAs(blob, 'image' + i + '.png');
    });
  }
  catch(err) {
    console.log(err);
    break;
  }
  i++;
}
*/


var chasing = false;
var chx = 277;
var chy = 144;
var mapping = false;
var mapx = "0";
var mapy = "0";
var dgear = "s";
$(function() {
  var ws;
  var logger = function(msg) {
    var now = new Date();
    var sec = now.getSeconds();
    var min = now.getMinutes();
    var hr = now.getHours();

    $("#log").html($("#log").html() + "<br/>" + hr + ":" + min + ":" + sec + " " + msg);
    $("#log").scrollTop($("#log")[0].scrollHeight);
    var h = "n";
    packet = msg.toString();
    var res = packet.split("_", 4);
    var h = res.slice(0, 1);
    var x = res.slice(1, 2);
    var y = res.slice(2, 3);
    var p = res.slice(3, 4);

    var xpos = parseInt(x);
    var ypos = parseInt(y);
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    xpos = xpos * 20;
    ypos = -ypos * 20;
    var x2 = xpos + 20;
    var y2 = ypos + 20;
    var y3 = ypos + 35;
    var d = "d";
    var c2 = "c";
    var no = "n";
    var yes = "y";
    h = h.slice(0, 1);
    var thp1 = "/images/thumbs/thumb";
    var thp2 = ".png";
    var thumbpath = thp1.concat(p, thp2);

    if (h == "m") {
      if (mapping == true) {
        ws.send("b");
      }
    }
    if (h == "d") {
      var imageObj = new Image();
      imageObj.onload = function() {
        ctx.drawImage(imageObj, xpos, ypos);
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px Arial";

        ctx.fillText(p, xpos, y3);
      };
      imageObj.src = thumbpath;

    }
    if (x == "u") {
      chy = chy - 5;
    }
    if (x == "d") {
      chy = chy + 5;
    }
    if (x == "l") {
      chx = chx - 5;
    }
    if (x == "r") {
      chx = chx + 5;
    }
    if (h == "g") {
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px Arial";

      ctx.fillText("x", chx, chy);
    }
    if (chasing == true) {
      if (h == "c") {
        ws.send("c");
      }
    }
  }
  var sender = function() {
    var msg = $("#msg").val();
    if (msg.length > 0)
      ws.send(msg);
    $("#msg").val(msg);
  }

  // ws = new WebSocket("ws://192.168.42.1:8888/ws");
  // ws.onmessage = function(evt) {
  //   logger(evt.data);
  // };
  // ws.onclose = function(evt) {
  //   $("#log").text("Connection Closed");
  //   $("#thebutton #msg").prop('disabled', true);
  // };
  // ws.onopen = function(evt) {
  //   $("#log").text("OGP-- SOCKET OPEN");
  //   ws.send('n');
  //
  // };
  $("#msg").keypress(function(event) {
    if (event.which == 13) {
      sender();
    }
  });
  $("#up").click(function() {
    if (dgear == "n") {

      ws.send('y');
    }
    if (dgear == "m") {
      ws.send('w');
    }
    if (dgear == "o") {
      ws.send('7');
    }
    if (dgear == "s") {
      ws.send('sqd');

    }
  });
  $("#down").click(function() {
    if (dgear == "n") {

      ws.send('g');
    }
    if (dgear == "m") {
      ws.send('z');
    }
    if (dgear == "o") {
      ws.send('9');
    }
    if (dgear == "s") {
      ws.send('squ');
    }
  });
  $("#left").click(function() {
    if (dgear == "n") {

      ws.send('h');
    }
    if (dgear == "m") {
      ws.send('a');
    }
    if (dgear == "o") {
      ws.send('2');
    }
    if (dgear == "s") {
      ws.send('sqr');
    }
  });
  $("#right").click(function() {
    if (dgear == "n") {

      ws.send('j');
    }
    if (dgear == "m") {
      ws.send('s');
    }
    if (dgear == "o") {
      ws.send('4');
    }
    if (dgear == "s") {
      ws.send('sql');
    }

  });

  $("#fucusIn").click(function() {
    ws.send('f');
  });
  $("#focusOut").click(function() {
    ws.send('t');
  });

  $("#minusButton").click(function() {
    dgear = "n";
  });
  $("#plusButton").click(function() {
    dgear = "m";
  });
  /*
  $("#open").click(function() {
    dgear = "o";
  });
  $("#map").click(function() {
    ws.send('n');
  });
  */
  $("#chase").click(function() {
    if (chasing == false) {

      chasing = true;
      mapping = false;
      ws.send('c');
    } else {
      chasing = false;
      ws.send('3');

    }
  });
  $("#map2").click(function() {
    var yes = "y";
    var no = "n";
    if (mapping == false) {
      mapping = true;
      chasing = false;
      ws.send('b');
    } else {
      mapping = false;
      ws.send('3');
    }
  });
  $("#autocal").click(function() {
    chasing = false;
    mapping = false;
    ws.send('k');
  });
  $("#allstop").click(function() {
    chasing = false;
    ws.send('3');
    var ch = 0;
  });
  $("#allstop2").click(function() {
    ws.send('8');
  });
  $("#main").click(function() {
    ws.send('c2');
  });
  $("#spotter").click(function() {
    ws.send('c1');
  });
  $("#longCapture").click(function() {
    ws.send('c4');
  });
  $("#capture").click(function() {
    ws.send('c3');
  });
  $("#mapsizea").click(function() {
    ws.send('p');

  });
  $("#mapsizeb").click(function() {
    ws.send('l');

  });
  $("#don").click(function() {
    ws.send('9');
  });
  $("#lon").click(function() {
    ws.send('2');
  });
  $("#ron").click(function() {
    ws.send('4');
  });
  $("#pic1").click(function() {
    ws.send('v');
  });
  $("#pic2").click(function() {
    ws.send('x');
  });
  $("#thebutton").click(function() {
    sender();
  });
  $("#splus").click(function() {
    ws.send('+');
  });
  $("#sminus").click(function() {
    ws.send('-');
  });
  $("#sq").click(function() {
    dgear = "s";
  });
});
/*
function downloadFile(url, success) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = "blob";
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (success) success(xhr.response);
        }
    };
    xhr.send(null);
}

window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
window.storageInfo = window.storageInfo || window.webkitStorageInfo;

// Request access to the file system
var fileSystem = null         // DOMFileSystem instance
  , fsType = PERSISTENT       // PERSISTENT vs. TEMPORARY storage
  , fsSize = 10 * 1024 * 1024 // size (bytes) of needed space
  ;

window.storageInfo.requestQuota(fsType, fsSize, function(gb) {
    window.requestFileSystem(fsType, gb, function(fs) {
        fileSystem = fs;
    }, errorHandler);
}, errorHandler);

function saveFile(data, path) {
    if (!fileSystem) return;

    fileSystem.root.getFile(path, {create: true}, function(fileEntry) {
        fileEntry.createWriter(function(writer) {
            writer.write(data);
        }, errorHandler);
    }, errorHandler);
}

function readFile(path, success) {
    fileSystem.root.getFile(path, {}, function(fileEntry) {
        fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
                if (success) success(this.result);
            };

            reader.readAsText(file);
        }, errorHandler);
    }, errorHandler);
}
*/
