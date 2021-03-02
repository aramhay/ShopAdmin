import pluginPkg from '../../package.json'
import pluginId from './pluginId'
import App from './containers/App'
import Initializer from './containers/Initializer'
import lifecycles from './lifecycles'
import trads from './translations'
import WysiwygWithErrors from './components/WysiwygWithErrors'

export default strapi => {
  const pluginDescription =
    pluginPkg.strapi.description || pluginPkg.description
  const { icon } = pluginPkg.strapi
  const { name } = pluginPkg.strapi

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: true,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    mainComponent: App,
    name,
    preventComponentRendering: false,
    trads
  }

  strapi.registerField({ type: 'wysiwyg', Component: WysiwygWithErrors })

  return strapi.registerPlugin(plugin)
}
