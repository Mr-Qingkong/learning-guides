/* 学习指南合集 · 共享交互脚本 */
(function () {
  // 复制按钮：复制所属 prompt-block 的正文（去掉标签与按钮）
  var copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var block = btn.closest('.prompt-block');
      var clone = block.cloneNode(true);
      var label = clone.querySelector('.prompt-label');
      var btnEl = clone.querySelector('.copy-btn');
      if (label) label.remove();
      if (btnEl) btnEl.remove();
      var text = clone.textContent.trim();
      var done = function () {
        btn.textContent = '已复制';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = '复制'; btn.classList.remove('copied'); }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text); done();
      }
    });
  });
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  // 练习清单进度条
  var items = document.querySelectorAll('.check-item');
  if (items.length) {
    var fill = document.getElementById('progressFill');
    var txt = document.getElementById('progressText');
    function update() {
      var done = 0;
      items.forEach(function (it) {
        var cb = it.querySelector('input[type=checkbox]');
        if (cb.checked) { it.classList.add('checked'); done++; }
        else { it.classList.remove('checked'); }
      });
      var pct = items.length ? Math.round((done / items.length) * 100) : 0;
      if (fill) fill.style.width = pct + '%';
      if (txt) txt.textContent = done + ' / ' + items.length;
    }
    items.forEach(function (it) {
      it.addEventListener('click', function (e) {
        if (e.target.tagName !== 'INPUT') {
          var cb = it.querySelector('input[type=checkbox]');
          cb.checked = !cb.checked;
        }
        update();
      });
    });
    update();
  }
})();
