export function useDataAction({ root, actions }) {
  root.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-action]');
    if (!trigger) return;
    const name = trigger.dataset.action;
    if (!name || !actions[name]) return;
    actions[name](event, trigger);
  });
}
