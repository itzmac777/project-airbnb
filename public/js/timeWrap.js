const timeDiv = document.querySelectorAll(".reviews-view-container-time");

const timeWrap = (gTime) => {
  cTime = gTime / 1000;
  fr = cTime / 60;
  y = 525600;
  m = 43200;
  w = 10080;
  d = 1440;
  h = 60;
  fTime = 0;
  fSuff = "";

  if (fr >= y) {
    fTime = Math.floor(fr / y);
    fSuff = "year";
  } else if (fr >= m) {
    fTime = Math.floor(fr / m);
    fSuff = "month";
  } else if (fr >= w) {
    fTime = Math.floor(fr / w);
    fSuff = "week";
  } else if (fr >= d) {
    fTime = Math.floor(fr / d);
    fSuff = "day";
  } else if (fr >= h) {
    fTime = Math.floor(fr / h);
    fSuff = "hour";
  } else if (fr >= 1) {
    fTime = Math.floor(fr);
    fSuff = "minute";
  } else {
    fTime = Math.floor(cTime);
    fSuff = "second";
  }

  if (fTime > 1) {
    fSuff = fSuff + "s";
  }
  return [fTime, fSuff];
};

if (timeDiv.length) {
  for (let div of timeDiv) {
    let gTime = Number(div.innerText);
    console.log(gTime);
    let [fTime, fSuff] = timeWrap(gTime);
    div.innerText = `${fTime} ${fSuff} ago`;
  }
}
