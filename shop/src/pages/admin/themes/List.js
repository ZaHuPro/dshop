import React from 'react'
import fbt from 'fbt'
import get from 'lodash/get'

import Link from 'components/Link'
import useConfig from 'utils/useConfig'
import useBackendApi from 'utils/useBackendApi'
import { useStateValue } from 'data/state'
import useThemes from '../../../utils/useThemes'

const ThemeSettings = () => {
  const { config } = useConfig()
  const [, dispatch] = useStateValue()
  const { post } = useBackendApi({ authToken: true })
  const { themes, loading } = useThemes()

  const activeThemeId = get(config, 'themeId')

  const switchToTheme = async (themeId) => {
    await post('/shop/config', {
      method: 'PUT',
      body: JSON.stringify({
        themeId
      })
    })
    dispatch({
      type: 'setConfigSimple',
      config: {
        ...config,
        themeId
      }
    })

    dispatch({
      type: 'toast',
      message: <fbt desc="admin.themes.themeChanged">Theme changed</fbt>
    })

    window.scrollTo(0, 0)
  }

  const previewTheme = async (themeId) => {
    const url = `${window.origin}/theme/${themeId}?shop=${config.backendAuthToken}`
    window.open(url, 'shop_preview')
  }

  return (
    <div>
      <h3 className="admin-title with-border">
        <fbt desc="Themes">Themes</fbt>
      </h3>
      <div className="row">
        <div className="shop-settings col-md-8 col-lg-9">
          {loading || !config.backend ? (
            <>
              <fbt desc="Loading">Loading</fbt>...
            </>
          ) : (
            <div className="theme-grid">
              {themes.map((theme) => {
                const isSelected = theme.id === activeThemeId
                return (
                  <div
                    className={`theme-select${isSelected ? ' active' : ''}`}
                    key={theme.id}
                  >
                    <img
                      src={`${config.backend}/theme/${theme.id}/screenshot.png`}
                    />
                    <div className="theme-label">{theme.name}</div>
                    <div className="actions">
                      {isSelected ? (
                        <Link
                          to="/admin/themes/customize"
                          className="btn btn-primary fg-white"
                        >
                          <fbt desc="admin.themes.customizeTheme">
                            Customize theme
                          </fbt>
                        </Link>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => switchToTheme(theme.id)}
                          >
                            <fbt desc="admin.themes.selectTheme">
                              Select this theme
                            </fbt>
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => previewTheme(theme.id)}
                          >
                            <fbt desc="admin.themes.previewTheme">
                              Preview Theme
                            </fbt>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ThemeSettings

require('react-styl')(`
  .theme-grid
    display: grid
    grid-template-columns: auto auto
    grid-column-gap: 1rem
    grid-row-gap: 1rem

    .theme-select
      border-radius: 5px
      border: solid 2px #cdd7e0
      position: relative
      &.active
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1)
        border: solid 2px #000000

      img
        height: 100%
        width: 100%
        object-fit: contain

      .theme-label
        text-align: center
        padding: 2rem 0
        font-weight: bold

      &:hover
        .actions
          display: flex

      .actions
        position: absolute
        cursor: pointer
        top: 0
        left: 0
        right: 0
        bottom: 0
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        display: none
        &:before
          content: ' '
          display: inline-block
          position: absolute
          top: 0
          left: 0
          right: 0
          bottom: 0
          background-color: #fff
          opacity: 0.5
          z-index: 0
           
        .btn
          margin: 0.75rem 0
          width: 200px
          opacity: 1
          z-index: 1
          color: #fff
          &:hover
            color: #fff
      
    
`)