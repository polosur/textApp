'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Copy } from 'lucide-react'

interface SavedText {
  id: number;
  content: string;
}

export default function TextSaver() {
  const [inputText, setInputText] = useState('')
  const [savedTexts, setSavedTexts] = useState<SavedText[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const saveButtonRef = useRef<HTMLButtonElement>(null)

  const handleSave = () => {
    if (inputText.trim()) {
      setSavedTexts(prev => [...prev, { id: Date.now(), content: inputText.trim() }])
      setInputText('')
      inputRef.current?.focus()
    }
  }

  const handleCopy = async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      <Textarea
        ref={inputRef}
        placeholder="Ingresa tu texto aquí"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[100px]"
      />
      <Button ref={saveButtonRef} onClick={handleSave} disabled={!inputText.trim()}>
        Guardar
      </Button>
      {savedTexts.map(({ id, content }) => (
        <Card key={id}>
          <CardContent className="pt-6">
            <p className="mb-4">{content}</p>
            <Button onClick={() => handleCopy(id, content)} variant="outline">
              {copiedId === id ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" /> Copiar al portapapeles
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}