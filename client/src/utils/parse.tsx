export const htmlDecode = (value: string) => {
  const el = document.createElement("div");

  return value.replace(/\&[#0-9a-z]+;/gi, function (enc) {
    el.innerHTML = enc;
    return el.innerText;
  });
};
