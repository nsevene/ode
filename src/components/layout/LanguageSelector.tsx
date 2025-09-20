import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronDown } from 'react-icons/fa'

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="ode-language-selector" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ode-language-selector-trigger"
      >
        <span className="ode-language-flag">{currentLanguage.flag}</span>
        <span className="ode-language-name">{currentLanguage.code.toUpperCase()}</span>
        <FaChevronDown className={`ode-language-chevron ${isOpen ? 'ode-language-chevron-open' : ''}`} />
      </button>

      {isOpen && (
        <div className="ode-language-dropdown">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`ode-language-option ${i18n.language === language.code ? 'ode-language-option-active' : ''}`}
            >
              <span className="ode-language-flag">{language.flag}</span>
              <span className="ode-language-name">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector