var mode = 0;
var expanded = false;
var exit = false;
var images = "";
var joystick = false;
var joyx = 3;
var joyy = 3;
var ws;
var ip = "192.168.2.9";

$(document).ready( function () {
  $(window).resize(updateSizes());
  window.onresize = updateSizes;
  window.onscroll = function() { window.scrollTo(0,0); }
  updateSizes();

  $('#log').hide();
  $('#mapDiv').css({left: window.innerWidth + 10});
  $('#imagesDiv').css({left: (window.innerWidth * 2) + 10});
  $('#imagesDiv').css({width: window.innerWidth - 20, top: 60, bottom: 10});
  $('#imagesContainer').css({scroll: 'hidden'});

  var i = 1;
  var nextImage = "ftp://pi:raspberry@" + ip + "/images/image" + i + ".png";
  checkImage(nextImage);
  function checkImage(src) {
    var img = new Image();
    img.onload = function() {
        // code to set the src on success
        images += "<img id=\"" + i + "\" src=\"" + src + "\"></img>";
        $('#imagesContainer').html(images);
        i++;
        var nextImage = "ftp://pi:banjobob@" + ip + "/images/image" + i + ".png";
        checkImage(nextImage)
    };
    img.onerror = function() {
      // doesn't exist or error loading
      console.log("error");
      $("#imagesDiv #loading").hide();
      $('#imagesContainer').css({scroll: 'scroll'});
    };
    img.src = src; // fires off loading of image
  }

  $('#joystickBubble').draggable({containment: 'parent'});

  $('#joystickBubble').mousedown(function(evt) {
    joystick = true;
  });


  $('#focusBubble').draggable({ axis: "x", containment: 'parent' });


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
});

var rtime;
var timeout = false;
var delta = 200;

function updateSizes() {

  // triggers resize end event
  // rtime = new Date();
  // if (timeout === false) {
  //     timeout = true;
  //     setTimeout(resizeend, delta);
  // }

  if (mode == 0 || mode == 5) {
    var extraSpace = window.innerWidth - 220;

    if (((extraSpace * 0.643) + 80) < window.innerHeight) {
      $("#videoDiv").css({width: extraSpace, height: ((extraSpace * 0.53) + 30)});
      if (mode == 0) { $("#videoDiv").css({left: 10}); $("#controlDiv").css({right: 10});}
      $("#videoDiv iframe").width(extraSpace);
      $("#videoDiv iframe").height(extraSpace * 0.53);
    }
    else {
      extraSpace = window.innerWidth - 200 - $("#videoDiv iframe").width();
      $("#videoDiv").css({height: window.innerHeight - 80, width: (window.innerHeight - 110) * 1.93});
      if (mode == 0) { $("#videoDiv").css({left: ((extraSpace / 2) + 10)}); $("#controlDiv").css({right: (extraSpace / 2)});}

      $("#videoDiv iframe").width((window.innerHeight - 80) * 1.93);
      $("#videoDiv iframe").height($("#videoDiv iframe").width() * 0.53 + 30);

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
    if (expanded == true) {
      var width = ($("#imagesDiv").height() - 20) * 1.3333;
      var height = $("#imagesDiv").height() - 20;
      var extraSpace = (window.innerWidth - width)/2;
      $('#imagesContainer').css({width: $('#imagesContainer').children().length * (width + 20)});
      $('#imagesContainer').children().css({width: width, height: height});
    }
  }

  resizeFrame($("#videoDiv").width());

}

function resizeend() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
    } else {
        timeout = false;
        if (ws != null) {
          ws.send("uc"+$("#videoDiv").width().toString());
        }
    }
}

function resizeFrame(width) {
  var scaleFactor = width/544;
  var offsetFactor = ((width*scaleFactor) - width) / 2;
  $('.frame').css({
    "-ms-transform": "scale(" + scaleFactor.toString() + ")",
    "-moz-transform": "scale(" + scaleFactor.toString() + ")",
    "-o-transform": "scale(" + scaleFactor.toString() + ")",
    "-webkit-transform": "scale(" + scaleFactor.toString() + ")",
    "transform": "scale(" + scaleFactor.toString() + ")",
    "width": width.toString() + "px",
    "marginLeft": (-1 * offsetFactor).toString() + "px"
  });
}

var chasing = false;
var chx = 277;
var chy = 144;
var mapping = false;
var nudgeSize = 1;
var mapx = "0";
var mapy = "0";
var dgear = "n";
$(function() {

  var logger = function(msg) {
    var now = new Date();
    var sec = now.getSeconds();
    var min = now.getMinutes();
    var hr = now.getHours();

    $("#log").html($("#log").html() + "<br/>" + hr + ":" + min + ":" + sec + " " + msg);
    $("#log").scrollTop($("#log")[0].scrollHeight);
    var h = "n";
    packet = msg.toString();

    //options
    //"rgb_$redcolor_$greencolor_$bluecolor"
    //"x_$centriodx_$centroidy" (of the blob)
    //"d_$x_$y_$p" (where x increments & decrements, y decrements, p increments)
    //OR
    //"$x $y'dark'"

    //"m" written after these messages in each cycle

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
    var thp1 = "/var/www/images/thumbs/thumb";
    var thp2 = ".png";
    var thumbpath = thp1.concat(p, thp2);


    // if should continue mapping, send again
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

  ws = new WebSocket("ws://" + ip + ":8888/ws");
  ws.onmessage = function(evt) {
    logger(evt.data);
  };
  ws.onclose = function(evt) {
    $("#log").text("Connection Closed");
    $("#thebutton #msg").prop('disabled', true);
  };
  ws.onopen = function(evt) {
    $("#log").text("OGP-- SOCKET OPEN");
    ws.send('n');
    ws.send("uc"+$("#videoDiv iframe").width().toString());
  };

  var joyCountdown = function(x, y) {
    console.log("Joy Repeat");
    if (joystick == true && joyx == x && joyy == y && (x != 3 || y != 3)) {
      ws.send('joy' + x + '' + y);
      setTimeout(function() {
        joyCountdown(x, y);
      }, 200);
    }
  }

  $(document).mousemove(function() {
    if (joystick == true) {
      //console.log(($('#joystickBubble').position().left - 57.5) + " ~ " + (($('#joystickBubble').position().top - 57.5) * -1));
      //ws.send('joy' + Math.round((($('#joystickBubble').position().left - 57.5)/20)+3) + '' + round(((($('#joystickBubble').position().top - 57.5) * -1)/20)+3));
      var x = Math.round((($('#joystickBubble').position().left - 57.5)/20)+3);
      var y = 6 - Math.round(((($('#joystickBubble').position().top - 57.5) * -1)/20)+3);
      console.log('joy' + joyx + '' + joyy);
      if (x != joyx || y != joyy) {
        joyx = x;
        joyy = y;
        ws.send('joy' + joyx + '' + joyy);
        console.log('joy' + joyx + '' + joyy);
        joyCountdown(x, y);
      }
    }
  });
  $(document).mouseup(function() {
    if (joystick == true) {
      $('#joystickBubble').css({ transition: '1s'});
      $('#joystickBubble').css({left: 57.5, top: 57.5});
      setTimeout( function() {$('#joystickBubble').css({ transition: 'none' });console.log("back");} , 1000);
      ws.send('joy33');
      joystick = false;
    }
  });
  $("#msg").keypress(function(event) {
    if (event.which == 13) {
      sender();
    }
  });
  $("#up").click(function() {
      ws.send('nu'+nudgeSize.toString()); //arduino 6
      console.log("up"); // nudge up
  });
  $("#up2").click(function() {
      ws.send('w'); //mapping up

    // if (dgear == "o") {
    //   ws.send('7'); //arudino 6 no stop
    // }
    // if (dgear == "s") {
    //   ws.send('sqd');
    //
    // }
  });
  $("#down").click(function() {
      console.log("down");
      ws.send('nd'+nudgeSize.toString()); // nudge down
  });
  $("#down2").click(function() {
      ws.send('z'); // mapping down
    // if (dgear == "o") {
    //   ws.send('9');
    // }
    // if (dgear == "s") {
    //   ws.send('squ');
    // }
  });
  $("#left").click(function() {
      console.log("left");
      ws.send('nl'+nudgeSize.toString()); // nudge left
  });
  $("#left2").click(function() {
      ws.send('a'); // mapping left
    // if (dgear == "o") {
    //   ws.send('2');
    // }
    // if (dgear == "s") {
    //   ws.send('sqr');
    // }
  });
  $("#right").click(function() {
      console.log("right");
      ws.send('nr'+nudgeSize.toString()); // nudge right
  });
  $("#right2").click(function() {
      ws.send('s'); // mapping right
    // if (dgear == "o") {
    //   ws.send('4');
    // }
    // if (dgear == "s") {
    //   ws.send('sql');
    // }

  });

  $("#stepsizea").click(function() {
    ws.send('+');
  });
  $("#stepsizeb").click(function() {
    ws.send('-');
  });

  $("#focusMinus").click(function() {
    ws.send('f');
  });
  $("#focusPlus").click(function() {
    ws.send('t');
  });

  // $("#minusButton").click(function() {
  //   dgear = "n";
  // });
  // $("#plusButton").click(function() {
  //   dgear = "m";
  // });
  /*
  $("#open").click(function() {
    dgear = "o";
  });*/

  //new map -> creates new so object that resets countdowns back to original value
  $("#map").click(function() {
    ws.send('n');
  });
  $("#chase").click(function() {
    if (chasing == false) {
      chasing = true;
      mapping = false;
      ws.send('c');
      $("#chase").text("Stop Chasing");
    } else {
      chasing = false;
      ws.send('3');
      $("#chase").text("Start Chasing");
    }
  });
  $("#map2").click(function() {
    var yes = "y";
    var no = "n";
    if (mapping == false) {
      mapping = true;
      chasing = false;
      ws.send('b');
      $("#map2").text("Stop Mapping");
    } else {
      mapping = false;
      ws.send('3');
      $("#map2").text("Start Mapping");
    }
  });
  $("#autocal").click(function() {
    chasing = false;
    mapping = false;
    ws.send('k');
  });
  // $("#allstop").click(function() {
  //   chasing = false;
  //   ws.send('3');
  //   var ch = 0;
  // });
  // $("#allstop2").click(function() {
  //   ws.send('8');
  // });
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

  $("#small").click(function() {
    nudgeSize = 1;
    $(this).css({"border-bottom-color": "purple"});
    $("#medium").css({"border-bottom-color": "grey"});
    $("#large").css({"background-color": "grey"});
  });
  $("#medium").click(function() {
    nudgeSize = 2;
    $("#small").css({"border-bottom-color": "grey"});
    $(this).css({"border-bottom-color": "purple"});
    $("#large").css({"background-color": "grey"});
  });
  $("#large").click(function() {
    nudgeSize = 3;
    $("#small").css({"border-bottom-color": "grey"});
    $("#medium").css({"border-bottom-color": "grey"});
    $(this).css({"background-color": "purple"});
  });

  // $("#don").click(function() {
  //   ws.send('9');
  // });
  // $("#lon").click(function() {
  //   ws.send('2');
  // });
  // $("#ron").click(function() {
  //   ws.send('4');
  // });
  $("#pic1").click(function() {
    ws.send('v');
  });
  $("#pic2").click(function() {
    ws.send('x');
  });
  $("#thebutton").click(function() {
    sender();
  });
  // $("#splus").click(function() {
  //   ws.send('+');
  // });
  // $("#sminus").click(function() {
  //   ws.send('-');
  // });
  // $("#sq").click(function() {
  //   dgear = "s";
  // });
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
