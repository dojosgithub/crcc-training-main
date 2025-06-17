import React from 'react';

export default class Dropdown extends React.Component {

    getMenuItemTitle = (menuItem, index, depthLevel) => {
      return menuItem.title;
    };
  
    getMenuItem = (menuItem, index,depthLevel) => {
      let title = this.getMenuItemTitle(menuItem, index, depthLevel);
  
      if (menuItem.submenu && menuItem.submenu.length > 0) {
        return (
          <li key={index}>
            {title+" "+depthLevel}
            <Dropdown config={menuItem.submenu} depthLevel={depthLevel+1} submenu={true} key={index} />
          </li>
        );
      } else {
        return <li key={index}>{title+" "+depthLevel}</li>;
      }
    };
  
    render = () => {
      let { config, depthLevel, className } = this.props;
  
      let _className = this.props.className || 'dropdown-menu';

      let options = [];
      config.map((item, index) => {
        options.push(this.getMenuItem(item, index, depthLevel ));
      });
  
      if (this.props.submenu && this.props.submenu === true)
        return <ul>{options}</ul>;
  
      return <ul className={_className}>{options}</ul>;
    };
  }
  
  
//   ReactDOM.render(<DropdownMenu depthLevel={0} config={[
//       {
//         "title": "Option 1",
//         "submenu": null
//       },
//       {
//         "title": "Option 2",
//         "submenu": [
//           {
//             "title": "Option 2.1",
//             "submenu": [
//               {
//                 "title": "Option 2.1.1",
//                 "submenu": null
//               },
//               {
//                 "title": "Option 2.1.2",
//                 "submenu": null
//               }
//             ]
//           },
//           {
//             "title": "Option 2.2",
//             "submenu": [
//               {
//                 "title": "Option 2.2.1",
//                 "submenu": null
//               },
//               {
//                 "title": "Option 2.2.2",
//                 "submenu": null
//               }
//             ]
//           }
//         ]
//       }
//     ]}/>, document.querySelector("#app"))
  
  