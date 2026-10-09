/* 软考专区 · 插图点击放大（自包含：自动注入样式，无需改动各页 CSS）
   用法：在页面 </body> 前引入 <script src="assets/zoom.js"></script> */
(function () {
  var d = document;

  /* 注入样式 */
  var css = [
    'figure{cursor:zoom-in}',
    '.rk-zoom{position:fixed;inset:0;z-index:400;background:rgba(10,18,26,.88);display:none;align-items:center;justify-content:center;padding:28px;cursor:zoom-out}',
    '.rk-zoom.open{display:flex}',
    '.rk-zoom img{max-width:min(1280px,94vw);max-height:86vh;border-radius:6px;background:#fff;box-shadow:0 24px 80px rgba(0,0,0,.5)}',
    '.rk-zoom .rk-close{position:fixed;top:14px;right:20px;width:40px;height:40px;line-height:40px;text-align:center;color:#fff;font-size:26px;background:rgba(255,255,255,.12);border-radius:50%;cursor:pointer;font-family:sans-serif;user-select:none}',
    '.rk-zoom .rk-close:hover{background:rgba(255,255,255,.24)}',
    '.rk-zoom .rk-cap{position:fixed;bottom:16px;left:0;right:0;text-align:center;color:#E8EEF4;font-size:13px;padding:0 20px;line-height:1.6}'
  ].join('\n');
  var st = d.createElement('style');
  st.textContent = css;
  d.head.appendChild(st);

  /* 构建浮层 */
  var box = null;
  function ensure() {
    if (box) return box;
    box = d.createElement('div');
    box.className = 'rk-zoom';
    box.innerHTML = '<div class="rk-close" title="关闭（Esc）">×</div><img alt=""><div class="rk-cap"></div>';
    d.body.appendChild(box);
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('rk-close')) close();
    });
    return box;
  }
  function open(src, cap) {
    var z = ensure();
    var img = z.querySelector('img');
    img.src = src;
    z.querySelector('.rk-cap').textContent = cap || '';
    z.classList.add('open');
    d.body.style.overflow = 'hidden';
  }
  function close() {
    if (!box) return;
    box.classList.remove('open');
    d.body.style.overflow = '';
  }
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  /* 绑定所有插图 */
  [].slice.call(d.querySelectorAll('figure img')).forEach(function (img) {
    var fig = img.closest('figure');
    var cap = fig ? fig.querySelector('figcaption') : null;
    var capText = cap ? cap.textContent.replace(/\s+/g, ' ').trim() : '';
    img.addEventListener('click', function () {
      open(img.getAttribute('src'), capText);
    });
  });
})();
