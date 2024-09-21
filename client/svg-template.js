export default function SvgTemplate(
    { imports, interfaces, componentName, props, jsx, exports },
    { tpl }
  ) {
    return tpl`
  import SvgIcon from '@mui/material/SvgIcon';
  ${imports}
  
  ${interfaces}
  
  const ${componentName} = (${props}) => {
    return React.createElement(SvgIcon, props, ${jsx.children})
  }
  
  ${exports}
    `;
  }