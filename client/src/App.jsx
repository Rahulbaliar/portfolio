import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';
import MagicBento from './MagicBento';

// Use the local public folder copy to avoid file:// restrictions:
const PROFILE_PIC = '/rahul-photo.jpg';
const PROFILE_PIC_FALLBACK = 'https://i.pravatar.cc/300?u=rahul';
// If needed, you can also keep the alternate local fallback:
// const PROFILE_PIC_FALLBACK = '/profile.jpg';

// ── DATA ────────────────────────────────────────────────────────
const SKILLS = {
  Languages:           ['C++','Python','JavaScript','PHP','Java'],
  Frameworks:          ['React.js','Node.js','HTML','CSS','Tailwind CSS'],
  'Tools & Platforms': ['MySQL','MongoDB','Git','GitHub'],
  'Soft Skills':       ['Problem-Solving','Teamwork','Adaptability','Quick Learner'],
};
const SKILL_LEVELS = {
  'C++':80,'Python':75,'JavaScript':90,'PHP':65,'Java':60,
  'React.js':88,'Node.js':82,'HTML':95,'CSS':90,'Tailwind CSS':85,
  'MySQL':72,'MongoDB':78,'Git':85,'GitHub':85,
  'Problem-Solving':90,'Teamwork':88,'Adaptability':85,'Quick Learner':95,
};
const PROJECTS = [
  {
    name:'Langleo – ChatBot',
    stack:['React.js','Node.js','MongoDB'],
    period:"Sep '25 – Dec '25",
    color:'#00f5d4',
    github:'https://github.com/Rahulbaliar',
    live:'https://langleo.netlify.app/',
    desc:'AI-powered language translation chatbot using Mistral AI API for real-time multilingual text conversion and robust Axios-based backend.',
    highlights:['Mistral AI API integration','Real-time multilingual translation','Modular scalable architecture'],
    image:'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
  },
  {
    name:'Art Folio',
    stack:['HTML','CSS','JavaScript','MySQL','PHP'],
    period:"Apr '24 – Jun '24",
    color:'#f72585',
    github:'https://github.com/Rahulbaliar',
    live:'https://shimmer-portfolio-hub.vercel.app/',
    desc:'Responsive portfolio website with dynamic galleries, contact forms, and MySQL database integration for efficient content management.',
    highlights:['Responsive UI/UX design','MySQL database integration','Cross-device compatibility'],
    image:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center',
  },
  {
    name:'Page Replacement Simulator',
    stack:['Python','Streamlit'],
    period:"Sep '24 – Nov '24",
    color:'#7209b7',
    github:'https://github.com/Rahulbaliar',
    live:'https://efficientpagereplacementsimulator-qeuthgtveexeuco2xryqk2.streamlit.app/',
    desc:'Interactive simulation of FIFO, LRU, and Optimal page replacement algorithms with live Streamlit charts and configurable parameters.',
    highlights:['FIFO, LRU & Optimal algorithms','Interactive Streamlit charts','Configurable frame sizes'],
    image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center',
  },
];
const CERTS = [
  {name:'C++ Programming: Mastering Data Structures & Algorithms', issuer:'LPU', date:"Jul' 25", link:'https://drive.google.com/file/d/1A8wWmBx5kDIxXf7_wDxzyp9nDzXqgYck/view'},
  {name:'Java Programming',                   issuer:'Iamneo',   date:"May '25", link:'https://lpucolab438.examly.io/certificate/U2FsdGVkX19Uzv1lOuh0JkST0wnOYkc2%2BCe9pQPfh9E%3D'},
  {name:'Cloud Computing',                    issuer:'NPTEL',    date:"Mar '25", link:'https://archive.nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS11S153730229004247102'},
  {name:'Object Oriented Programming',        issuer:'Iamneo',   date:"Dec '24", link:'https://lpucolab438.examly.io/certificate/U2FsdGVkX1%2FKXbj7sauxubpo0DG8Vv%2Fz3G84s0w618Q%3D'},
  {name:'TCP/IP and Advanced Topics',         issuer:'Coursera', date:"Nov '24", link:'https://www.coursera.org/account/accomplishments/verify/EE9M6ZQMMNPG'},
  {name:'Bits & Bytes of Computer Networking',issuer:'Coursera', date:"Sep '24", link:'https://www.coursera.org/account/accomplishments/verify/XPJW90JQIGTH'},
  {name:'Computer Communication',             issuer:'Coursera', date:"Aug '24", link:'https://www.coursera.org/account/accomplishments/specialization/P7V6CZIBKMCP'},
  {name:'Computer Programming',               issuer:'Iamneo',   date:"May '24", link:'https://lpucolab438.examly.io/certificate/U2FsdGVkX19JbdG3P67hloCWz1CHAl8V%2FTrFz1m6pQo%3D'}
];
const EDUCATION = [
  {school:'Lovely Professional University', location:'Phagwara, Punjab', degree:'B.Tech – Computer Science & Engineering', period:"Aug '23 – Present", score:'CGPA: 7.9'},
  {school:'RPS Public School',              location:'Rewari, Haryana',  degree:'Intermediate (PCM)',                      period:"Mar '22 – May '23", score:'74.4%'},
  {school:'RPS Public School',              location:'Rewari, Haryana',  degree:'Matriculation',                          period:"Mar '20 – May '21", score:'74.4%'},
];
const ACHIEVEMENTS = [
  {icon:'🏆',text:'Secured Top 1% Rank in NPTEL Exam',date:"Mar '25"},
  {icon:'💻',text:'Solved 500+ problems on LeetCode (DSA, graph, DP)',date:"2024-2025"},
  {icon:'🎓',text:'Earned 4+ certifications including NPTEL Cloud Computing and LPU DSA program',date:"2025"},
];
const THEMES = [
  {id:'t-dark',   label:'Cyber Dark', bg:'linear-gradient(135deg,#04040c,#0d0d1f)', dot:'#00f5d4'},
  {id:'t-aurora', label:'Aurora',     bg:'linear-gradient(135deg,#050d1a,#0a1628)', dot:'#64ffda'},
  {id:'t-sunset', label:'Sunset',     bg:'linear-gradient(135deg,#0f0700,#1a0e03)', dot:'#ff6b35'},
  {id:'t-forest', label:'Forest',     bg:'linear-gradient(135deg,#020d05,#041a08)', dot:'#39d353'},
  {id:'t-galaxy', label:'Galaxy',     bg:'linear-gradient(135deg,#07001a,#0f0026)', dot:'#bf5fff'},
  {id:'t-light',  label:'Light',      bg:'linear-gradient(135deg,#eef2ff,#e5eaff)', dot:'#6366f1'},
];
const PAGES  = ['home','about','resume','education','skills','projects','certifications','achievements','contact'];
const LABELS = ['Home','About','Resume','Education','Skills','Projects','Certifications','Achievements','Contact'];
const ROLES  = ['Full Stack Developer','React.js Engineer','Node.js Backend Dev','MongoDB Specialist','Problem Solver'];

// ── SPLASH CURSOR ──────────────────────────────────────────────────
function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0.5, g: 0, b: 0 },
  TRANSPARENT = true
}) {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Track if the effect is still active for cleanup
    let isActive = true;

    function pointerPrototype() {
      this.id = -1;
      this.texcoordX = 0;
      this.texcoordY = 0;
      this.prevTexcoordX = 0;
      this.prevTexcoordY = 0;
      this.deltaX = 0;
      this.deltaY = 0;
      this.down = false;
      this.moved = false;
      this.color = [0, 0, 0];
    }

    let config = {
      SIM_RESOLUTION,
      DYE_RESOLUTION,
      CAPTURE_RESOLUTION,
      DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION,
      PRESSURE,
      PRESSURE_ITERATIONS,
      CURL,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      SHADING,
      COLOR_UPDATE_SPEED,
      PAUSED: false,
      BACK_COLOR,
      TRANSPARENT
    };

    let pointers = [new pointerPrototype()];

    const { gl, ext } = getWebGLContext(canvas);
    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    function getWebGLContext(canvas) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false
      };
      let gl = canvas.getContext('webgl2', params);
      const isWebGL2 = !!gl;
      if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);

      let halfFloat;
      let supportLinearFiltering;
      if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float');
        supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
      } else {
        halfFloat = gl.getExtension('OES_texture_half_float');
        supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
      }
      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat && halfFloat.HALF_FLOAT_OES;
      let formatRGBA;
      let formatRG;
      let formatR;

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering
        }
      };
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case gl.R16F:
            return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
          case gl.RG16F:
            return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
          default:
            return null;
        }
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      return status === gl.FRAMEBUFFER_COMPLETE;
    }

    class Material {
      constructor(vertexShader, fragmentShaderSource) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = [];
        this.activeProgram = null;
        this.uniforms = [];
      }
      setKeywords(keywords) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
        let program = this.programs[hash];
        if (program == null) {
          let fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          program = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = program;
        }
        if (program === this.activeProgram) return;
        this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }
      bind() {
        gl.useProgram(this.activeProgram);
      }
    }

    class Program {
      constructor(vertexShader, fragmentShader) {
        this.uniforms = {};
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = getUniforms(this.program);
      }
      bind() {
        gl.useProgram(this.program);
      }
    }

    function createProgram(vertexShader, fragmentShader) {
      let program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) console.trace(gl.getProgramInfoLog(program));
      return program;
    }

    function getUniforms(program) {
      let uniforms = [];
      let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        let uniformName = gl.getActiveUniform(program, i).name;
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
      }
      return uniforms;
    }

    function compileShader(type, source, keywords) {
      source = addKeywords(source, keywords);
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.trace(gl.getShaderInfoLog(shader));
      return shader;
    }

    function addKeywords(source, keywords) {
      if (!keywords) return source;
      let keywordsString = '';
      keywords.forEach(keyword => {
        keywordsString += '#define ' + keyword + '\n';
      });
      return keywordsString + source;
    }

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `
    );

    const copyShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
      `
    );

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
      `
    );

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `;

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `
    );

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `,
      ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']
    );

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `
    );

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `
    );

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `
    );

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `
    );

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `
    );

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      return (target, clear = false) => {
        if (target == null) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        if (clear) {
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    let dye, velocity, divergence, curl, pressure;

    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    function initFramebuffers() {
      let simRes = getResolution(config.SIM_RESOLUTION);
      let dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);

      if (!dye)
        dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
      else
        dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

      if (!velocity)
        velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
      else
        velocity = resizeDoubleFBO(
          velocity,
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );

      divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    function createFBO(w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0);
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      let texelSizeX = 1.0 / w;
      let texelSizeY = 1.0 / h;
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        }
      };
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value;
        },
        swap() {
          let temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        }
      };
    }

    function resizeFBO(target, w, h, internalFormat, format, type, param) {
      let newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO);
      return newFBO;
    }

    function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1.0 / w;
      target.texelSizeY = 1.0 / h;
      return target;
    }

    function updateKeywords() {
      let displayKeywords = [];
      if (config.SHADING) displayKeywords.push('SHADING');
      displayMaterial.setKeywords(displayKeywords);
    }

    updateKeywords();
    initFramebuffers();
    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;

    function updateFrame() {
      if (!isActive) return;
      const dt = calcDeltaTime();
      if (resizeCanvas()) initFramebuffers();
      updateColors(dt);
      applyInputs();
      step(dt);
      render(null);
      animationFrameId.current = requestAnimationFrame(updateFrame);
    }

    function calcDeltaTime() {
      let now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastUpdateTime = now;
      return dt;
    }

    function resizeCanvas() {
      let width = scaleByPixelRatio(canvas.clientWidth);
      let height = scaleByPixelRatio(canvas.clientHeight);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    function updateColors(dt) {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
        pointers.forEach(p => {
          p.color = generateColor();
        });
      }
    }

    function applyInputs() {
      pointers.forEach(p => {
        if (p.moved) {
          p.moved = false;
          splatPointer(p);
        }
      });
    }

    function step(dt) {
      gl.disable(gl.BLEND);
      curlProgram.bind();
      gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradienSubtractProgram.bind();
      gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!ext.supportLinearFiltering)
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      let velocityId = velocity.read.attach(0);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!ext.supportLinearFiltering)
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function render(target) {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      drawDisplay(target);
    }

    function drawDisplay(target) {
      let width = target == null ? gl.drawingBufferWidth : target.width;
      let height = target == null ? gl.drawingBufferHeight : target.height;
      displayMaterial.bind();
      if (config.SHADING) gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
      gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      blit(target);
    }

    function splatPointer(pointer) {
      let dx = pointer.deltaX * config.SPLAT_FORCE;
      let dy = pointer.deltaY * config.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function clickSplat(pointer) {
      const color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      let dx = 10 * (Math.random() - 0.5);
      let dy = 30 * (Math.random() - 0.5);
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    }

    function splat(x, y, dx, dy, color) {
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function correctRadius(radius) {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }

    function updatePointerDownData(pointer, id, posX, posY) {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = generateColor();
    }

    function updatePointerMoveData(pointer, posX, posY, color) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      pointer.color = color;
    }

    function updatePointerUpData(pointer) {
      pointer.down = false;
    }

    function correctDeltaX(delta) {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    }

    function correctDeltaY(delta) {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    }

    function generateColor() {
      let c = HSVtoRGB(Math.random(), 1.0, 1.0);
      c.r *= 0.15;
      c.g *= 0.15;
      c.b *= 0.15;
      return c;
    }

    function HSVtoRGB(h, s, v) {
      let r, g, b, i, f, p, q, t;
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
          break;
        default:
          break;
      }
      return { r, g, b };
    }

    function wrap(value, min, max) {
      const range = max - min;
      if (range === 0) return min;
      return ((value - min) % range) + min;
    }

    function getResolution(resolution) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);
      if (gl.drawingBufferWidth > gl.drawingBufferHeight) return { width: max, height: min };
      else return { width: min, height: max };
    }

    function scaleByPixelRatio(input) {
      const pixelRatio = window.devicePixelRatio || 1;
      return Math.floor(input * pixelRatio);
    }

    function hashCode(s) {
      if (s.length === 0) return 0;
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }

    // Named event handlers for proper cleanup
    function handleMouseDown(e) {
      let pointer = pointers[0];
      let posX = scaleByPixelRatio(e.clientX);
      let posY = scaleByPixelRatio(e.clientY);
      updatePointerDownData(pointer, -1, posX, posY);
      clickSplat(pointer);
    }

    let firstMouseMoveHandled = false;
    function handleMouseMove(e) {
      let pointer = pointers[0];
      let posX = scaleByPixelRatio(e.clientX);
      let posY = scaleByPixelRatio(e.clientY);
      if (!firstMouseMoveHandled) {
        let color = generateColor();
        updatePointerMoveData(pointer, posX, posY, color);
        firstMouseMoveHandled = true;
      } else {
        updatePointerMoveData(pointer, posX, posY, pointer.color);
      }
    }

    function handleTouchStart(e) {
      const touches = e.targetTouches;
      let pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        let posX = scaleByPixelRatio(touches[i].clientX);
        let posY = scaleByPixelRatio(touches[i].clientY);
        updatePointerDownData(pointer, touches[i].identifier, posX, posY);
      }
    }

    function handleTouchMove(e) {
      const touches = e.targetTouches;
      let pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        let posX = scaleByPixelRatio(touches[i].clientX);
        let posY = scaleByPixelRatio(touches[i].clientY);
        updatePointerMoveData(pointer, posX, posY, pointer.color);
      }
    }

    function handleTouchEnd(e) {
      const touches = e.changedTouches;
      let pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        updatePointerUpData(pointer);
      }
    }

    // Add event listeners
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, false);
    window.addEventListener('touchend', handleTouchEnd);

    updateFrame();

    // Cleanup function
    return () => {
      isActive = false;

      // Cancel animation frame
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }

      // Remove event listeners
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        pointerEvents: 'none',
        width: '100%',
        height: '100%'
      }}
    >
      <canvas
        ref={canvasRef}
        id="fluid"
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block'
        }}
      />
    </div>
  );
}

// ── CURSOR HOOK ──────────────────────────────────────────────────
function useCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const trailRef = useRef(null);
  useEffect(() => {
    let mx=0, my=0, rx=0, ry=0, tt=0, raf;
    const getC1 = () => getComputedStyle(document.body).getPropertyValue('--c1').trim() || '0,245,212';
    const move = e => {
      mx=e.clientX; my=e.clientY;
      if(dotRef.current){ dotRef.current.style.left=mx+'px'; dotRef.current.style.top=my+'px'; }
      const now = Date.now();
      if(now-tt<45) return; tt=now;
      if(trailRef.current){
        const d = document.createElement('div');
        const sz = Math.random()*5+3;
        const c1 = getC1();
        d.className='trail-dot';
        d.style.cssText=`left:${mx}px;top:${my}px;width:${sz}px;height:${sz}px;background:rgba(${c1},${(Math.random()*.45+.2).toFixed(2)});animation-duration:${(Math.random()*.3+.4).toFixed(2)}s`;
        trailRef.current.appendChild(d);
        setTimeout(()=>d.remove(), 700);
      }
    };
    const lerp = () => {
      rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
      if(ringRef.current){ ringRef.current.style.left=rx+'px'; ringRef.current.style.top=ry+'px'; }
      raf=requestAnimationFrame(lerp);
    };
    const down = () => document.body.classList.add('clicked');
    const up   = () => document.body.classList.remove('clicked');
    document.addEventListener('mousemove', move);
    document.addEventListener('mousedown', down);
    document.addEventListener('mouseup',   up);
    lerp();
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mousedown', down);
      document.removeEventListener('mouseup',   up);
      cancelAnimationFrame(raf);
    };
  }, []);
  return { dotRef, ringRef, trailRef };
}

// ── TYPED HOOK ───────────────────────────────────────────────────
function useTyped(roles) {
  const [text, setText] = useState('');
  useEffect(() => {
    let ri=0, ci=0, del=false;
    const iv = setInterval(() => {
      const cur = roles[ri];
      if(!del){ ci++; if(ci>cur.length) del=true; }
      else { ci--; if(ci<0){ del=false; ri=(ri+1)%roles.length; ci=0; } }
      setText(cur.slice(0,ci));
    }, 85);
    return ()=>clearInterval(iv);
  }, [roles]);
  return text;
}

// ── AOS HOOK ─────────────────────────────────────────────────────
function useAOS() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e,i) => { if(e.isIntersecting) setTimeout(()=>e.target.classList.add('visible'), i*60); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.aos-item').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

// ── HOVER CURSOR ─────────────────────────────────────────────────
function useHoverCursor() {
  useEffect(() => {
    const on  = () => document.body.classList.add('hovered');
    const off = () => document.body.classList.remove('hovered');
    const sel = 'a,button,.skill-chip,.proj-card,.cert-card,.ach-item,.contact-link,.theme-swatch,.wid-card,.nav-btn';
    const attach = () => {
      document.querySelectorAll(sel).forEach(el => { el.addEventListener('mouseenter',on); el.addEventListener('mouseleave',off); });
    };
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, {childList:true, subtree:true});
    return () => mo.disconnect();
  }, []);
}

// ══════════════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════════

// ── THEME SWITCHER ───────────────────────────────────────────────
function ThemeSwitcher({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="theme-switcher">
      <button className="theme-toggle-btn" onClick={() => setOpen(o=>!o)}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        🎨
      </button>
      <div className={`theme-panel${open?' open':''}`}>
        <div className="panel-title">Select Theme</div>
        <div className="theme-grid">
          {THEMES.map(t => (
            <div key={t.id} className={`theme-swatch${theme===t.id?' active':''}`}
              onClick={()=>{setTheme(t.id);setOpen(false);}}>
              <div className="swatch-box" style={{background:t.bg}}><div className="swatch-dot" style={{background:t.dot}}/></div>
              <span className="swatch-label">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── NAVBAR ───────────────────────────────────────────────────────
function Navbar({ page, setPage }) {
  const [mOpen, setMOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div
          className="logo"
          onClick={() => setPage('home')}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => { if (e.key === 'Enter') setPage('home'); }}
          style={{ cursor: 'pointer' }}
        >
          <span className="logo-r">R</span><span className="logo-rest">AHUL</span><span className="logo-dot">.</span>
        </div>
        <div className="nav-links">
          {PAGES.map((p,i) => (
            <button key={p} className={`nav-btn${page===p?' active':''}`} onClick={() => setPage(p)}>
              {LABELS[i]}
            </button>
          ))}
        </div>
        <button className="hamburger" onClick={() => setMOpen(o=>!o)}>☰</button>
      </div>
      {mOpen && (
        <div style={{background:'var(--nav)',borderTop:'1px solid var(--border)'}}>
          {PAGES.map((p,i) => (
            <button key={p} className={`nav-btn${page===p?' active':''}`}
              style={{display:'block',width:'100%',textAlign:'left',padding:'13px 2rem',borderRadius:0,borderBottom:'1px solid var(--border)'}}
              onClick={()=>{setPage(p);setMOpen(false);}}>
              {LABELS[i]}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── SECTION HEADER ───────────────────────────────────────────────
function SectionHeader({ label, title }) {
  return (
    <div className="section-header">
      <p className="label-tag section-eyebrow">{label}</p>
      <h2 className="display-lg">{title}</h2>
      <div className="section-divider"/>
    </div>
  );
}

// ── HOME PAGE ────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const typed = useTyped(ROLES);
  useAOS();
  const [form, setForm] = useState({name:'',email:'',message:''});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setStatus('');
    try {
      const res = await fetch('/api/contact', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if(data.success){ setStatus('success'); setForm({name:'',email:'',message:''}); }
      else setStatus('error');
    } catch { setStatus('error'); }
    finally { setLoading(false); }
  };
  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-grid-bg"/>
        <div className="hero-inner">
          <div>
            <div className="avail-badge aos-item">
              <span className="avail-dot"/><span className="label-tag">Available for work</span>
            </div>
            <h1 className="display-xl aos-item" style={{marginTop:4}}>
              <span className="grad-text">Code</span> Meets<br/>
              <span className="grad-text">Creativity</span>
              <span className="outline-text" style={{marginLeft:16}}>.</span>
            </h1>
            <div className="typed-wrap aos-item">
              <span className="typed-prefix">{'>'}_</span>
              <span className="typed-text">{typed}</span>
              <span className="typed-cursor">|</span>
            </div>
            <p className="hero-desc aos-item">
              Passionate Full Stack Developer crafting scalable web applications with
              React, Node.js & MongoDB. I turn complex problems into clean, elegant
              digital experiences — from AI chatbots to OS simulators.
            </p>
            <div className="hero-cta aos-item">
              <a href="mailto:rahulyad62005@gmail.com" className="btn-primary">Hire Me →</a>
              <a href="https://github.com/Rahulbaliar" className="btn-ghost" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/rahulyad" className="btn-ghost" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
            <div className="hero-stats aos-item">
              {[['3+','Projects'],['4','Certifications'],['7.9','CGPA'],['1%','NPTEL Rank']].map(([n,l],i,arr)=>(
                <div key={l} style={{display:'flex',alignItems:'center',gap:24}}>
                  <div className="stat-block"><div className="stat-number">{n}</div><div className="stat-label">{l}</div></div>
                  {i<arr.length-1 && <div className="stat-sep"/>}
                </div>
              ))}
            </div>
          </div>
          {/* Avatar */}
          <div className="avatar-wrap">
            <div className="orbit-ring orbit-1"/><div className="orbit-ring orbit-2"/>
            <div className="avatar-circle">
              <img
                src={PROFILE_PIC}
                alt="Rahul"
                style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}}
                onError={e => { e.target.onerror = null; e.target.src = PROFILE_PIC_FALLBACK; }}
              />
            </div>
            <div className="float-chip chip-1">⚛️ React.js</div>
            <div className="float-chip chip-2">🟢 Node.js</div>
            <div className="float-chip chip-3">🍃 MongoDB</div>
          </div>
        </div>
      </section>

      {/* WHAT I DO */}
      <div className="what-i-do">
        <div className="wid-inner">
          <p className="label-tag" style={{marginBottom:8}}>What I Do</p>
          <h2 className="display-md">My Expertise</h2>
          <div className="wid-grid">
            {[
              {icon:'⚛️',title:'Frontend Development',desc:'Building responsive, pixel-perfect UIs with React.js, Tailwind CSS, and modern JavaScript. Performance-first, accessibility-aware.'},
              {icon:'🟢',title:'Backend Development',desc:'Designing scalable REST APIs with Node.js and Express. Clean architecture, JWT auth, and middleware-driven patterns.'},
              {icon:'🍃',title:'Database Design',desc:'Crafting efficient schemas in MongoDB and MySQL. From data modeling to aggregation pipelines and query optimization.'},
              {icon:'🤖',title:'AI Integration',desc:'Wiring up LLMs and AI APIs — like Mistral — into production apps. Real-time translation, NLP, and intelligent automation.'},
            ].map(c => (
              <div key={c.title} className="wid-card aos-item">
                <span className="wid-icon">{c.icon}</span>
                <div className="wid-title">{c.title}</div>
                <div className="wid-desc">{c.desc}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'2.5rem'}}>
            <button className="btn-primary" onClick={() => setPage('projects')}>See My Projects →</button>
          </div>
        </div>
      </div>

      {/* EDUCATION */}
      <div className="section">
        <div className="section-header">
          <p className="label-tag section-eyebrow">Academic Journey</p>
          <h2 className="display-lg">Education</h2>
          <div className="section-divider"/>
        </div>
        <div className="edu-tl">
          <div className="tl-line"/>
          {EDUCATION.map(e => (
            <div key={e.school+e.degree} className="edu-item aos-item">
              <div className="edu-dot"/>
              <div className="edu-card">
                <div className="edu-top">
                  <h3 className="edu-school">{e.school}</h3>
                  <span className="date-pill">{e.period}</span>
                </div>
                <p className="edu-degree body-sm">{e.degree}</p>
                <div className="edu-meta">
                  <span>📍 {e.location}</span>
                  <span className="score">{e.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SKILLS */}
      <div className="section">
        <div className="section-header">
          <p className="label-tag section-eyebrow">What I Know</p>
          <h2 className="display-lg">Skills & Expertise</h2>
          <p className="body-lg" style={{color:'var(--tx2)', marginTop:'0.75rem', maxWidth:'760px', margin:'0 auto'}}>
            Core technical skills and strengths I apply in real-world projects and collaborative team delivery.
          </p>
          <div className="section-divider"/>
        </div>

        {Object.entries(SKILLS).map(([cat,items]) => (
          <div key={cat} className="skill-category">
            <p className="label-tag skill-cat-label">{cat}</p>
            <div className="skill-chips">
              {items.map(sk => (
                <div key={sk} className="skill-chip aos-item">
                  <div className="skill-chip-name">{sk}</div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{width:`${SKILL_LEVELS[sk]||75}%`}}/></div>
                  <div className="skill-pct">{SKILL_LEVELS[sk]||75}%</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PROJECTS */}
      <div className="section">
        <div className="section-header">
          <p className="label-tag section-eyebrow">What I Built</p>
          <h2 className="display-lg">Projects</h2>
          <div className="section-divider"/>
        </div>
        <div className="proj-grid">
          {PROJECTS.map(p => (
            <div key={p.name} className="proj-card aos-item">
              <div className="proj-card-glow" style={{background:`linear-gradient(90deg,transparent,${p.color},transparent)`}}/>
              <div className="proj-header">
                <div className="proj-period" style={{color:p.color,background:`${p.color}18`,border:`1px solid ${p.color}33`}}>{p.period}</div>
                <div className="proj-links-row">
                  <a href={p.github} target="_blank" rel="noreferrer" className="proj-link" style={{color:'var(--tx2)',borderColor:'var(--border)'}}>⎇ Code</a>
                  <a href={p.live} target="_blank" rel="noreferrer" className="proj-link" style={{color:p.color,borderColor:`${p.color}55`}}>Live ↗</a>
                </div>
              </div>
              <img src={p.image} alt={p.name} className="proj-image" style={{width:'100%', height:'210px', objectFit:'cover', borderRadius:'10px', marginBottom:'16px'}} />
              <h3 className="proj-name">{p.name}</h3>
              <p className="proj-desc">{p.desc}</p>
              <div className="proj-tags">{p.stack.map(s=><span key={s} className="proj-tag">{s}</span>)}</div>
              <div className="proj-highlights">
                {p.highlights.map(h=><div key={h} className="proj-hl"><div className="hl-dot" style={{background:p.color}}/>{h}</div>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CERTIFICATIONS */}
      <div className="section">
        <div className="section-header">
          <p className="label-tag section-eyebrow">Credentials</p>
          <h2 className="display-lg">Certifications</h2>
          <div className="section-divider"/>
        </div>
        <div className="cert-grid">
          {CERTS.map(c => (
            <div key={c.name} className="cert-card aos-item">
              <div className="cert-accent"/>
              <p className="label-tag cert-issued">Certified</p>
              <h3 className="cert-name">{c.name}</h3>
              <p className="cert-issuer">{c.issuer} · {c.date}</p>
              {c.link ? (
                <a href={c.link} target="_blank" rel="noreferrer" className="cert-view">View Certificate ↗</a>
              ) : (
                <span className="cert-view">View Certificate ↗</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="section">
        <div className="section-header">
          <p className="label-tag section-eyebrow">Milestones</p>
          <h2 className="display-lg">Achievements</h2>
          <div className="section-divider"/>
        </div>
        <div className="ach-list">
          {ACHIEVEMENTS.map(a => (
            <div key={a.text} className="ach-item aos-item">
              <div className="ach-icon">{a.icon}</div>
              <div><div className="ach-text">{a.text}</div><div className="ach-date">{a.date}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <div className="section">
        <div className="section-header">
          <p className="label-tag section-eyebrow">Get In Touch</p>
          <h2 className="display-lg">Contact Me</h2>
          <div className="section-divider"/>
        </div>
        <div className="contact-grid">
          <div>
            <p className="contact-intro">
              I'm open to full-time roles and freelance projects. Let's build something
              incredible together — drop a message and I'll get back within 24 hours.
            </p>
            {[
              {icon:'✉',label:'email',val:'rahulyad62005@gmail.com',href:'mailto:rahulyad62005@gmail.com'},
              {icon:'📱',label:'phone',val:'+91 9813180113',href:'tel:+919813180113'},
              {icon:'🔗',label:'linkedin',val:'linkedin.com/in/rahulyad',href:'https://www.linkedin.com/in/rahulyad'},
              {icon:'💻',label:'github',val:'github.com/Rahulbaliar',href:'https://github.com/Rahulbaliar'},
            ].map(c => (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="contact-link aos-item">
                <div className="c-icon">{c.icon}</div>
                <div><div className="c-label">{c.label}</div><div className="c-val">{c.val}</div></div>
              </a>
            ))}
          </div>  
          <form onSubmit={handleSubmit} className="aos-item">
            {[{f:'name',l:'your_name',t:'text',ph:'Name'},{f:'email',l:'email_address',t:'email',ph:'you@example.com'}].map(({f,l,t,ph})=>(
              <div key={f} className="form-group">
                <label className="form-label">{l.replace(/_/g,' ')}</label>
                <input className="form-input" type={t} placeholder={ph} required
                  value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}/>
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input" placeholder="Tell me about your project..." required
                value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
            </div>
            <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={loading}>
              {loading ? 'Sending...' : 'Send Message →'}
            </button>
            {status==='success'   && <p className="form-status success">✓ Message sent! I'll reply soon.</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

// ── ABOUT PAGE ───────────────────────────────────────────────────
function AboutPage() {
  useAOS();
  const typed = useTyped(ROLES);
  return (
    <section className="hero-section">
      <div className="hero-grid-bg"/>
      <div className="hero-inner">
        <div>
          <div className="avail-badge aos-item"><span className="avail-dot"/><span className="label-tag">Available for work</span></div>
          <h1 className="display-xl aos-item" style={{marginTop:4}}>
            Hi, I'm<br/><span className="grad-text">Rahul</span>
          </h1>
          <div className="typed-wrap aos-item">
            <span className="typed-prefix">{'>'}_</span>
            <span className="typed-text">{typed}</span>
            <span className="typed-cursor">|</span>
          </div>
          <p className="hero-desc aos-item">
            I'm a passionate Full Stack Developer currently pursuing B.Tech in Computer Science
            at Lovely Professional University. I build scalable web apps with React, Node.js and
            MongoDB, and love turning complex problems into clean, elegant solutions.
            I also have strong soft skills in collaboration, communication, problem-solving and
            ownership, and I thrive in high-performance team environments.
          </p>
          <div className="about-skills aos-item" style={{marginTop:'1.3rem',marginBottom:'1.8rem'}}>
            <h3 style={{fontSize:'1.05rem',marginBottom:'12px'}}>Soft Skills</h3>
            <div className="skill-chips" style={{gap:'12px'}}>
              {SKILLS['Soft Skills'].map(s => (
                <div key={s} className="skill-chip" style={{minWidth:'150px',padding:'12px 16px'}}>
                  <div className="skill-chip-name" style={{fontSize:'13px'}}>{s}</div>
                  <div className="skill-bar-bg" style={{width:'90px',height:'4px',margin:'6px 0'}}>
                    <div className="skill-bar-fill" style={{width:`${SKILL_LEVELS[s]||85}%`,height:'100%'}}/>
                  </div>
                  <div className="skill-pct">{SKILL_LEVELS[s]||85}%</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-cta aos-item">
            <a href="mailto:rahulyad62005@gmail.com" className="btn-primary">Hire Me →</a>
            <a href="https://github.com/Rahulbaliar" className="btn-ghost" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/rahulyad" className="btn-ghost" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
          <div className="hero-stats aos-item">
            {[['3+','Projects'],['4','Certs'],['7.9','CGPA'],['1%','NPTEL']].map(([n,l],i,arr)=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:24}}>
                <div className="stat-block"><div className="stat-number">{n}</div><div className="stat-label">{l}</div></div>
                {i<arr.length-1 && <div className="stat-sep"/>}
              </div>
            ))}
          </div>
        </div>
        <div className="avatar-wrap">
          <div className="orbit-ring orbit-1"/><div className="orbit-ring orbit-2"/>
          <div className="avatar-circle">
            <img
              src={PROFILE_PIC}
              alt="Rahul"
              style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}}
              onError={e => { e.target.onerror = null; e.target.src = PROFILE_PIC_FALLBACK; }}
            />
          </div>
          <div className="float-chip chip-1">⚛️ React.js</div>
          <div className="float-chip chip-2">🟢 Node.js</div>
          <div className="float-chip chip-3">🍃 MongoDB</div>
        </div>
      </div>
    </section>
  );
}

// ── RESUME ───────────────────────────────────────────────────────
function ResumePage() {
  useAOS();
  return (
    <div className="section">
      <SectionHeader label="my_background" title="Resume"/>
      <div className="resume-card aos-item">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:10,marginBottom:16}}>
          <div>
            <p className="label-tag resume-tag">Training</p>
            <h3 className="display-md" style={{marginTop:4}}>C++ Programming: Mastering Data Structures & Algorithms</h3>
          </div>
          <span className="date-pill">Jul’ 25</span>
        </div>
        <div className="resume-bullets">
          {['Intensive DSA training — arrays, linked lists, stacks, queues, recursion, sorting & searching','Solved structured problem sets implementing core data structures with clean, optimised C++ code','Built a Gym Management System using OOP and file handling — record creation, member search & display'].map(b => (
            <div key={b} className="bullet-line"><span className="bullet-arrow">›</span><span>{b}</span></div>
          ))}
        </div>
      </div>
      <div style={{textAlign:'center',marginTop:36}}>
        <a href="https://drive.google.com/file/d/1WJuaboujT9fDiDJQaeeEEVbull6LErtr/view?usp=drivesdk" className="btn-primary">Download Full Resume ↓</a>
      </div>
    </div>
  );
}

// ── EDUCATION ────────────────────────────────────────────────────
function EducationPage() {
  useAOS();
  return (
    <div className="section">
      <SectionHeader label="academic_journey" title="Education"/>
      <div className="edu-tl">
        <div className="tl-line"/>
        {EDUCATION.map(e => (
          <div key={e.school+e.degree} className="edu-item aos-item">
            <div className="edu-dot"/>
            <div className="edu-card">
              <div className="edu-top">
                <h3 className="edu-school">{e.school}</h3>
                <span className="date-pill">{e.period}</span>
              </div>
              <p className="edu-degree body-sm">{e.degree}</p>
              <div className="edu-meta">
                <span>📍 {e.location}</span>
                <span className="score">{e.score}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SKILLS ───────────────────────────────────────────────────────
function SkillsPage() {
  useAOS();
  return (
    <div className="section">
      <SectionHeader label="what_i_know" title="My Skills"/>
      {Object.entries(SKILLS).map(([cat,items]) => (
        <div key={cat} className="skill-category">
          <p className="label-tag skill-cat-label">{cat}</p>
          <div className="skill-chips">
            {items.map(sk => (
              <div key={sk} className="skill-chip aos-item">
                <div className="skill-chip-name">{sk}</div>
                <div className="skill-bar-bg"><div className="skill-bar-fill" style={{width:`${SKILL_LEVELS[sk]||75}%`}}/></div>
                <div className="skill-pct">{SKILL_LEVELS[sk]||75}%</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PROJECTS ─────────────────────────────────────────────────────
function ProjectsPage() {
  useAOS();
  return (
    <div className="section">
      <SectionHeader label="what_i_built" title="Projects"/>
      <div className="proj-grid">
        {PROJECTS.map(p => (
          <div key={p.name} className="proj-card aos-item">
            <div className="proj-card-glow" style={{background:`linear-gradient(90deg,transparent,${p.color},transparent)`}}/>
            <div className="proj-header">
              <div className="proj-period" style={{color:p.color,background:`${p.color}18`,border:`1px solid ${p.color}33`}}>{p.period}</div>
              <div className="proj-links-row">
                <a href={p.github} target="_blank" rel="noreferrer" className="proj-link" style={{color:'var(--tx2)',borderColor:'var(--border)'}}>⎇ Code</a>
                <a href={p.live} target="_blank" rel="noreferrer" className="proj-link" style={{color:p.color,borderColor:`${p.color}55`}}>Live ↗</a>
              </div>
            </div>
            <img src={p.image} alt={p.name} className="proj-image" style={{width:'100%', height:'200px', objectFit:'cover', borderRadius:'8px', marginBottom:'16px'}}/>
            <h3 className="proj-name">{p.name}</h3>
            <p className="proj-desc">{p.desc}</p>
            <div className="proj-tags">{p.stack.map(s=><span key={s} className="proj-tag">{s}</span>)}</div>
            <div className="proj-highlights">
              {p.highlights.map(h=><div key={h} className="proj-hl"><div className="hl-dot" style={{background:p.color}}/>{h}</div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CERTIFICATIONS ───────────────────────────────────────────────
function CertificationsPage() {
  useAOS();
  return (
    <div className="section">
      <SectionHeader label="credentials" title="Certifications"/>
      <div className="cert-grid">
        {CERTS.map(c => (
          <div key={c.name} className="cert-card aos-item">
            <div className="cert-accent"/>
            <p className="label-tag cert-issued">Certified</p>
            <h3 className="cert-name">{c.name}</h3>
            <p className="cert-issuer">{c.issuer} · {c.date}</p>
            <a href={c.link} target="_blank" rel="noopener noreferrer" className="cert-view">View Certificate ↗</a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ACHIEVEMENTS ─────────────────────────────────────────────────
function AchievementsPage() {
  useAOS();
  return (
    <div className="section">
      <SectionHeader label="milestones" title="Achievements"/>
      <div className="ach-list">
        {[
          {icon:'�',text:'Secured Top 1% Rank in NPTEL Exam',date:"Mar '25"},
          {icon:'💻',text:'Solved 500+ problems on LeetCode (DSA, graph, dynamic programming)',date:"2024-2025"},
          {icon:'🎓',text:'Earned 4+ certifications including NPTEL Cloud Computing and LPU DSA program',date:"2025"},
        ].map(a => (
          <div key={a.text} className="ach-item aos-item">
            <div className="ach-icon">{a.icon}</div>
            <div><div className="ach-text">{a.text}</div><div className="ach-date">{a.date}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CONTACT ──────────────────────────────────────────────────────
function ContactPage() {
  useAOS();
  const [form, setForm] = useState({name:'',email:'',message:''});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setStatus('');
    try {
      const res = await fetch('/api/contact', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if(data.success){ setStatus('success'); setForm({name:'',email:'',message:''}); }
      else setStatus('error');
    } catch { setStatus('error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="section">
      <SectionHeader label="get_in_touch" title="Contact Me"/>
      <div className="contact-grid">
        <div>
          <p className="contact-intro">
            I'm open to full-time roles and freelance projects. Let's build something
            incredible together — drop a message and I'll get back within 24 hours.
          </p>
          {[
            {icon:'✉',label:'email',val:'rahulyad62005@gmail.com',href:'mailto:rahulyad62005@gmail.com'},
            {icon:'📱',label:'phone',val:'+91 9813180113',href:'tel:+919813180113'},
            {icon:'🔗',label:'linkedin',val:'linkedin.com/in/rahulyad',href:'https://www.linkedin.com/in/rahulyad'},
            {icon:'💻',label:'github',val:'github.com/Rahulbaliar',href:'https://github.com/Rahulbaliar'},
          ].map(c => (
            <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="contact-link aos-item">
              <div className="c-icon">{c.icon}</div>
              <div><div className="c-label">{c.label}</div><div className="c-val">{c.val}</div></div>
            </a>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="aos-item">
          {[{f:'name',l:'your_name',t:'text',ph:'Name'},{f:'email',l:'email_address',t:'email',ph:'you@example.com'}].map(({f,l,t,ph})=>(
            <div key={f} className="form-group">
              <label className="form-label">{l.replace(/_/g,' ')}</label>
              <input className="form-input" type={t} placeholder={ph} required
                value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}/>
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-input" placeholder="Tell me about your project..." required
              value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
          </div>
          <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={loading}>
            {loading ? 'Sending...' : 'Send Message →'}
          </button>
          {status==='success' && <p className="form-status success">✓ Message sent! I'll reply soon.</p>}
        </form>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  ROOT APP
// ══════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage]   = useState('home');
  const [theme, setTheme] = useState('t-dark');
  const { dotRef, ringRef, trailRef } = useCursor();
  useHoverCursor();

  // apply theme
  useEffect(() => {
    document.body.className = theme;
    window.scrollTo({top:0, behavior:'smooth'});
  }, [theme, page]);

  const PAGE_MAP = {
    home:            <HomePage setPage={setPage}/>,
    about:           <AboutPage/>,
    resume:          <ResumePage/>,
    education:       <EducationPage/>,
    skills:          <SkillsPage/>,
    projects:        <ProjectsPage/>,
    certifications:  <CertificationsPage/>,
    achievements:    <AchievementsPage/>,
    contact:         <ContactPage/>,
  };

  return (
    <>
      {/* CURSOR */}
      <div className="cursor-dot"  ref={dotRef}/>
      <div className="cursor-trail" ref={trailRef}/>

      {/* FLUID BG */}
      <SplashCursor/>

      {/* MAGIC BENTO BG */}
      <MagicBento
        textAutoHide={true}
        enableStars
        enableSpotlight
        enableBorderGlow={true}
        enableTilt={false}
        enableMagnetism={false}
        clickEffect
        spotlightRadius={400}
        particleCount={12}
        glowColor="132, 0, 255"
        disableAnimations={false}
      />

      {/* THEME SWITCHER */}
      <ThemeSwitcher theme={theme} setTheme={setTheme}/>

      {/* NAV */}
      <Navbar page={page} setPage={setPage}/>

      {/* PAGES */}
      <div className="page-wrap" key={page} style={{animation:'fadeUp .4s ease'}}>
        {PAGE_MAP[page]}
      </div>

      <footer>
        <div className="footer-brand">© 2025 Rahul Yadav | Full Stack Developer | Passionate about creating innovative web solutions</div>
        <div className="footer-links">
          <a href="https://github.com/Rahulbaliar" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/rahulyad" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:rahulyad62005@gmail.com">Email</a>
          <a href="https://drive.google.com/file/d/1WJuaboujT9fDiDJQaeeEEVbull6LErtr/view?usp=drivesdk" target="_blank" rel="noreferrer">Resume</a>
        </div>
      </footer>
    </>
  );
}
