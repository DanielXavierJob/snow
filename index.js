var meuAudio = document.getElementById('meuAudio');



MorphSVGPlugin.convertToPath("polygon");
var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function (s) {
    return document.querySelector(s);
  },
  selectAll = function (s) {
    return document.querySelectorAll(s);
  },
  pContainer = select(".pContainer"),
  mainSVG = select(".mainSVG"),
  star = select("#star"),
  sparkle = select(".sparkle"),
  tree = select("#tree"),
  showParticle = true,
  particleColorArray = [
    "#E8F6F8",
    "#ACE8F8",
    "#F6FBFE",
    "#A2CBDC",
    "#B74551",
    "#5DBA72",
    "#910B28",
    "#910B28",
    "#446D39",
  ],
  particleTypeArray = ["#star", "#circ", "#cross", "#heart"],
  // particleTypeArray = ['#star'],
  particlePool = [],
  particleCount = 0,
  numParticles = 201;

gsap.set("svg", {
  visibility: "visible",
});

gsap.set(sparkle, {
  transformOrigin: "50% 50%",
  y: -100,
});

let getSVGPoints = (path) => {
  let arr = [];
  var rawPath = MotionPathPlugin.getRawPath(path)[0];
  rawPath.forEach((el, value) => {
    let obj = {};
    obj.x = rawPath[value * 2];
    obj.y = rawPath[value * 2 + 1];
    if (value % 2) {
      arr.push(obj);
    }
    //console.log(value)
  });

  return arr;
};
let treePath = getSVGPoints(".treePath"),
  treeBottomPath = getSVGPoints(".treeBottomPath"),
  mainTl = gsap.timeline({ delay: 0, repeat: 0 }),
  starTl;

function flicker(p) {
  gsap.killTweensOf(p, { opacity: true });
  gsap.fromTo(
    p,
    {
      opacity: 1,
    },
    {
      duration: 0.07,
      opacity: Math.random(),
      repeat: -1,
    }
  );
}

function createParticles() {
  var i = numParticles,
    p,
    particleTl,
    step = numParticles / treePath.length,
    pos;
  while (--i > -1) {
    p = select(particleTypeArray[i % particleTypeArray.length]).cloneNode(true);
    mainSVG.appendChild(p);
    p.setAttribute("fill", particleColorArray[i % particleColorArray.length]);
    p.setAttribute("class", "particle");
    particlePool.push(p);
    //hide them initially
    gsap.set(p, {
      x: -100,
      y: -100,
      transformOrigin: "50% 50%",
    });
  }
}

var getScale = gsap.utils.random(0.5, 3, 0.001, true);
var acabou = false;
function playParticle(p) {
  if (!showParticle) {
    if (acabou == false) {
      iniciar();
      acabou = true;
    }
    return;
  }
  var p = particlePool[particleCount];
  gsap.set(p, {
    x: gsap.getProperty(".pContainer", "x"),
    y: gsap.getProperty(".pContainer", "y"),
    scale: getScale(),
  });
  var tl = gsap.timeline();
  tl.to(p, {
    duration: gsap.utils.random(0.61, 6),
    physics2D: {
      velocity: gsap.utils.random(-23, 23),
      angle: gsap.utils.random(-180, 180),
      gravity: gsap.utils.random(-6, 50),
    },
    scale: 0,
    rotation: gsap.utils.random(-123, 360),
    ease: "power1",
    onStart: flicker,
    onStartParams: [p],
    onRepeat: (p) => {
      gsap.set(p, {
        scale: getScale(),
      });
    },
    onRepeatParams: [p],
  });

  particleCount++;
  particleCount = particleCount >= numParticles ? 0 : particleCount;
}

function drawStar() {
  starTl = gsap.timeline({ onUpdate: playParticle });
  starTl
    .to(".pContainer, .sparkle", {
      duration: 6,
      motionPath: {
        path: ".treePath",
        autoRotate: false,
      },
      ease: "linear",
    })
    .to(".pContainer, .sparkle", {
      duration: 1,
      onStart: function () {
        showParticle = false;
      },
      x: treeBottomPath[0].x,
      y: treeBottomPath[0].y,
    })
    .to(
      ".pContainer, .sparkle",
      {
        duration: 2,
        onStart: function () {
          showParticle = true;
        },
        motionPath: {
          path: ".treeBottomPath",
          autoRotate: false,
        },
        ease: "linear",
      },
      "-=0"
    )
    .from(
      ".treeBottomMask",
      {
        duration: 2,
        drawSVG: "0% 0%",
        stroke: "#FFF",
        ease: "linear",
      },
      "-=2"
    );
}



mainTl
  .from([".treePathMask", ".treePotMask"], {
    duration: 6,
    drawSVG: "0% 0%",
    stroke: "#FFF",
    stagger: {
      each: 6,
    },
    duration: gsap.utils.wrap([6, 1, 2]),
    ease: "linear",
  })
  .from(
    ".treeStar",
    {
      duration: 3,
      scaleY: 0,
      scaleX: 0.15,
      transformOrigin: "50% 50%",
      ease: "elastic(1,0.5)",
    },
    "-=4"
  )

  .to(
    ".sparkle",
    {
      duration: 3,
      opacity: 0,
      ease: "rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})",
    },
    "-=0"
  )
  .to(
    ".treeStarOutline",
    {
      duration: 1,
      opacity: 1,
      ease: "rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})",
    },
    "+=1"
  );

mainTl.add(starTl, 0);
gsap.globalTimeline.timeScale(1.5);

particlesJS("particles-js", {
  particles: {
    number: { value: 400, density: { enable: true, value_area: 800 } },
    color: { value: "#d7d7d7" },
    shape: {
      type: "circle",
      stroke: { width: 0, color: "#000000" },
      polygon: { nb_sides: 5 },
      image: { src: "img/github.svg", width: 100, height: 100 },
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
    },
    size: {
      value: 10,
      random: true,
      anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
    },
    line_linked: {
      enable: false,
      distance: 500,
      color: "#ffffff",
      opacity: 0.4,
      width: 2,
    },
    move: {
      enable: true,
      speed: 6,
      direction: "bottom",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "bubble" },
      onclick: { enable: true, mode: "repulse" },
      resize: true,
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 0.5 } },
      bubble: { distance: 400, size: 4, duration: 0.3, opacity: 1, speed: 3 },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 },
    },
  },
  retina_detect: true,
});
var count_particles, stats, update;
stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "0px";
stats.domElement.style.top = "0px";
document.body.appendChild(stats.domElement);
count_particles = document.querySelector(".js-count-particles");
update = function () {
  stats.begin();
  stats.end();
  if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
    count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
  }
  requestAnimationFrame(update);
};
function tocado(){
  document.getElementById('particles-js').style.visibility = 'visible'
  document.getElementById('scene').style.display = 'block'
  document.getElementById('mainSVG').style.display = 'block'
  document.getElementById('tirarr').style.display = 'none'
  meuAudio.style.display = 'none'
  meuAudio.play();
  createParticles();
  drawStar();
requestAnimationFrame(update);
  
  }