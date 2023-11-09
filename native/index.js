const cubism2Model =
"https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/haru/haru_greeter_t03.model3.json";
// const cubism4Model =
//  

const live2d = PIXI.live2d;

(async function main() {
  const app = new PIXI.Application({
    view: document.getElementById("canvas"),
    autoStart: true,
    resizeTo: window,
    backgroundColor: 0x333333
  });

  const models = await Promise.all([
    live2d.Live2DModel.from(cubism2Model),
    // live2d.Live2DModel.from(cubism4Model)
  ]);
  
  // 对于模型进行遍历
  models.forEach((model) => {
    app.stage.addChild(model);

    const scaleX = (innerWidth * 1) / model.width;
    const scaleY = (innerHeight * 1) / model.height;

    // fit the window
    model.scale.set(Math.min(scaleX, scaleY));

    model.y = innerHeight * 0.1;
    // 给模型增加拖拽监听
    draggable(model);
    // 给模型增加帧监听
    addFrame(model);
    // 给模型增加点击监听
    addHitAreaFrames(model);
  });

  const model = models[0];
//   const model4 = models[1];

  model.x = (innerWidth)/100;
//   model4.x = model2.x + model2.width;

  // handle tapping

  model.on("hit", (hitAreas) => {
    if (hitAreas.includes("body")) {
      model.motion("tap_body");
    }

    if (hitAreas.includes("head")) {
      model.expression();
    }
  });
})();

function draggable(model) {
  model.buttonMode = true;
  model.on("pointerdown", (e) => {
    model.dragging = true;
    model._pointerX = e.data.global.x - model.x;
    model._pointerY = e.data.global.y - model.y;
  });
  model.on("pointermove", (e) => {
    if (model.dragging) {
      model.position.x = e.data.global.x - model._pointerX;
      model.position.y = e.data.global.y - model._pointerY;
    }
  });
  model.on("pointerupoutside", () => (model.dragging = false));
  model.on("pointerup", () => (model.dragging = false));
}

function addFrame(model) {
  const foreground = PIXI.Sprite.from(PIXI.Texture.WHITE);
  foreground.width = model.internalModel.width;
  foreground.height = model.internalModel.height;
  foreground.alpha = 0.2;

  model.addChild(foreground);

  checkbox("Model Frames", (checked) => (foreground.visible = checked));
}

function addHitAreaFrames(model) {
  const hitAreaFrames = new live2d.HitAreaFrames();
  model.addChild(hitAreaFrames);
  checkbox("Hit Area Frames", (checked) => (hitAreaFrames.visible = checked));
}

function checkbox(name, onChange) {
  const id = name.replace(/\W/g, "").toLowerCase();

  let checkbox = document.getElementById(id);

  if (!checkbox) {
    const p = document.createElement("p");
    p.innerHTML = `<input type="checkbox" id="${id}"> <label for="${id}">${name}</label>`;

    document.getElementById("control").appendChild(p);
    checkbox = p.firstChild;
  }

  checkbox.addEventListener("change", () => {
    onChange(checkbox.checked);
  });

  onChange(checkbox.checked);
}
