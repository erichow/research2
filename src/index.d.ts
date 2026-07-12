/**
 * Proxy-wrapped return type for useDataRef.
 * Each ref name maps to either a single HTMLElement or an HTMLElement[].
 * For multi-element refs, array properties (length, forEach, [n]…) delegate to the array;
 * DOM properties (value, textContent…) forward to the first element at runtime.
 */
export type DataRefProxy<Refs extends string> = {
  [K in Refs]: HTMLElement | HTMLElement[];
} & {
  [key: string]: HTMLElement | HTMLElement[] | undefined;
};

/**
 * Scan root's subtree for [data-ref] elements and return a Proxy keyed by ref name.
 *
 * @example
 * const refs = useDataRef<'username' | 'item'>(root);
 * refs.username.value       // HTMLElement.value
 * refs.item.forEach(...)    // HTMLElement[].forEach
 */
export declare function useDataRef<Refs extends string = string>(
  root: Element
): DataRefProxy<Refs>;

/**
 * Action callback signature.
 * @param event - The original DOM event (typically MouseEvent for click).
 * @param element - The [data-action] element that triggered the action.
 */
export type ActionHandler = (event: Event, element: HTMLElement) => void;

/**
 * Constraint for the actions map passed to useDataAction.
 */
export type DataActions = Record<string, ActionHandler>;

/**
 * Bind click event delegation on root for [data-action] elements.
 *
 * @example
 * useDataAction({
 *   root,
 *   actions: {
 *     submit(ev, el) { ... },
 *     delete(ev, el) { ... },
 *   }
 * });
 */
export declare function useDataAction<Actions extends DataActions>(opts: {
  root: Element;
  actions: Actions;
}): void;
