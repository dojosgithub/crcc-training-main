/**
 * Dom util library (client-side)
 *
 * David Kim
 */

//-- Dom selector to get the selected dom object
export const Dom  = {
  elem(selector) {
    return document.getElementById(selector) || document.querySelectorAll(selector)
  }
}
