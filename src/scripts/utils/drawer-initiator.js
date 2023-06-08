/* eslint-disable no-undef */

const DrawerInitiator = {
  init({ button, drawer, content }) {
    jQuery((button)).click(() => {
      jQuery((drawer)).addClass('open');
    });

    jQuery((content)).click(() => {
      jQuery(drawer).removeClass('open');
    });
  },
};

export default DrawerInitiator;
