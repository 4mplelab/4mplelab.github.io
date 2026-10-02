const root = document.documentElement;
const read = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
const save = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch {} };
const desktop = matchMedia('(min-width: 1024px)');
const wideToc = matchMedia('(min-width: 72rem)');
const button = document.querySelector<HTMLButtonElement>('[data-sidebar-toggle]');
const edge = document.querySelector<HTMLButtonElement>('[data-panel-toggle="sidebar"]');
const pane = document.getElementById('starlight__sidebar');
const backdrop = document.querySelector<HTMLButtonElement>('[data-sidebar-backdrop]');
const main = document.querySelector<HTMLElement>('.main-frame');
if (button && edge && pane && backdrop && main) {
  document.body.append(backdrop);
  let collapsed = read('lism.sidebar-collapsed') === 'true';
  let mobileOpen = false;
  const isOpen = () => desktop.matches ? !collapsed : mobileOpen;
  const render = () => {
    const open = isOpen();
    root.dataset.sidebarOpen = String(open);
    for (const control of [button, edge]) {
      control.setAttribute('aria-expanded', String(open));
      control.setAttribute('aria-label', open ? 'メニューを格納' : 'メニューを表示');
      control.title = open ? 'メニューを格納' : 'メニューを表示';
    }
    pane.inert = !desktop.matches && !open;
    pane.setAttribute('aria-hidden', String(!desktop.matches && !open));
    const modal = !desktop.matches && open;
    backdrop.hidden = !modal;
    main.inert = modal;
    document.body.classList.toggle('guide-menu-open', modal);
  };
  const closeMobile = () => { mobileOpen = false; render(); button.focus(); };
  edge.addEventListener('click', () => {
    collapsed = !collapsed;
    save('lism.sidebar-collapsed', String(collapsed));
    render();
  });
  button.addEventListener('click', () => {
    mobileOpen = !mobileOpen;
    render();
    if (mobileOpen) pane.querySelector<HTMLElement>('a[aria-current="page"], a, summary')?.focus();
  });
  pane.querySelectorAll<HTMLElement>('[data-guide-group]').forEach(summary => {
    summary.addEventListener('click', event => {
      if (desktop.matches && collapsed) {
        event.preventDefault();
        collapsed = false;
        save('lism.sidebar-collapsed', 'false');
        (summary.parentElement as HTMLDetailsElement).open = true;
        render();
      }
    });
  });
  backdrop.addEventListener('click', closeMobile);
  document.addEventListener('keydown', (event) => {
    if (!desktop.matches && mobileOpen) {
      if (event.key === 'Escape') { event.preventDefault(); closeMobile(); }
      if (event.key === 'Tab') {
        const items = [button, ...Array.from(pane.querySelectorAll<HTMLElement>('a[href], button, summary, [tabindex="0"]')).filter(el => el.getClientRects().length > 0)];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
  });
  desktop.addEventListener('change', () => {
    const focusedInside = pane.contains(document.activeElement);
    mobileOpen = false;
    render();
    if (focusedInside && !isOpen()) (desktop.matches ? edge : button).focus();
  });
  render();
}

const tocButton = document.querySelector<HTMLButtonElement>('[data-panel-toggle="toc"]');
const tocPanel = document.querySelector<HTMLElement>('.right-sidebar-panel');
const tocContainer = document.querySelector<HTMLElement>('.right-sidebar-container');
if (tocButton && tocPanel && tocContainer) {
  // Keep controls outside the scrolling panel so their edge positioning is not clipped.
  tocContainer.append(tocButton);
  const resize = document.querySelector<HTMLElement>('[data-panel-resize="toc"]');
  if (resize) tocContainer.append(resize);
  tocPanel.id = 'guide-desktop-toc';
  let collapsed = read('lism.toc-collapsed') === 'true';
  const render = () => {
    root.dataset.tocOpen = String(!collapsed);
    tocButton.setAttribute('aria-expanded', String(!collapsed));
    tocButton.setAttribute('aria-label', collapsed ? '目次を表示' : '目次を格納');
    tocButton.title = collapsed ? '目次を表示' : '目次を格納';
    tocPanel.inert = wideToc.matches && collapsed;
    tocPanel.setAttribute('aria-hidden', String(wideToc.matches && collapsed));
  };
  tocButton.addEventListener('click', () => {
    collapsed = !collapsed;
    save('lism.toc-collapsed', String(collapsed));
    render();
  });
  wideToc.addEventListener('change', render);
  render();
}

for (const handle of document.querySelectorAll<HTMLElement>('[data-panel-resize]')) {
  const side = handle.dataset.panelResize!;
  const isLeft = side === 'sidebar';
  const minimum = Number(handle.getAttribute('aria-valuemin'));
  const maximum = Number(handle.getAttribute('aria-valuemax'));
  const key = `lism.${side}-width`;
  const stored = Number(read(key));
  let width = stored > 0 && Number.isFinite(stored) ? stored : isLeft ? 260 : 195;
  const apply = (value: number) => {
    width = Math.min(maximum, Math.max(minimum, value));
    root.style.setProperty(`--guide-${side}-size`, `${width}px`);
    handle.setAttribute('aria-valuenow', String(width));
    handle.setAttribute('aria-valuetext', `${width}px`);
  };
  apply(isLeft && width === 280 ? 260 : width);
  let drag: { id: number; x: number; width: number } | null = null;
  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    handle.focus();
    drag = { id: event.pointerId, x: event.clientX, width };
    handle.setPointerCapture(event.pointerId);
    root.classList.add('panel-resizing');
  });
  handle.addEventListener('pointermove', (event) => {
    if (drag && event.pointerId === drag.id) apply(drag.width + (event.clientX - drag.x) * (isLeft ? 1 : -1));
  });
  const finish = () => {
    if (!drag) return;
    const id = drag.id;
    drag = null;
    if (handle.hasPointerCapture(id)) handle.releasePointerCapture(id);
    root.classList.remove('panel-resizing');
    save(key, String(width));
  };
  handle.addEventListener('pointerup', finish);
  handle.addEventListener('pointercancel', finish);
  handle.addEventListener('lostpointercapture', finish);
  window.addEventListener('blur', finish);
  desktop.addEventListener('change', finish);
  wideToc.addEventListener('change', finish);
  handle.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    apply(event.key === 'Home' ? minimum : event.key === 'End' ? maximum : width + (event.key === 'ArrowRight' ? 10 : -10) * (isLeft ? 1 : -1));
    save(key, String(width));
  });
}
