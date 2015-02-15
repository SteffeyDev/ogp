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

  ws = new WebSocket("ws://192.168.42.1:8888/ws");
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

  };
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
  $("#in").click(function() {
    ws.send('f');
  });
  $("#out").click(function() {
    ws.send('t');
  });
  $("#short").click(function() {
    dgear = "n";
  });
  $("#long").click(function() {
    dgear = "m";
  });
  $("#open").click(function() {
    dgear = "o";
  });
  $("#map").click(function() {
    ws.send('n');
  });
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
  $("#cam2").click(function() {
    ws.send('c2');
  });
  $("#cam1").click(function() {
    ws.send('c1');
  });
  $("#cam4").click(function() {
    ws.send('c4');
  });
  $("#cam3").click(function() {
    ws.send('c3');
  });
  $("#mapsizea").click(function() {
    ws.send('p');

  });
  $("#cam2").click(function() {
    ws.send('c2');

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
