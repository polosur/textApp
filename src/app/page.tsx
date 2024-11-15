'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Copy, Trash, Edit } from 'lucide-react'

interface SavedText {
  id: number;
  content: string;
}

export default function TextSaver() {
  const [inputText, setInputText] = useState('')
  const [savedTexts, setSavedTexts] = useState<SavedText[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const saveButtonRef = useRef<HTMLButtonElement>(null)

  const handleSave = () => {
    if (inputText.trim()) {
      if (editingId !== null) {
        setSavedTexts(prev => prev.map(text => 
          text.id === editingId ? { ...text, content: inputText.trim() } : text
        ))
        setEditingId(null)
      } else {
        setSavedTexts(prev => [...prev, { id: Date.now(), content: inputText.trim() }])
      }
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

  const handleDelete = (id: number) => {
    setSavedTexts(prev => prev.filter(text => text.id !== id))
  }

  const handleEdit = (id: number, content: string) => {
    setEditingId(id)
    setInputText(content)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Textarea
          ref={inputRef}
          placeholder="Ingresa tu texto aquí"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[100px]"
        />
        <Button 
          ref={saveButtonRef} 
          onClick={handleSave} 
          disabled={!inputText.trim()} 
          className="mt-2"
        >
          {editingId !== null ? 'Actualizar' : 'Guardar'}
        </Button>
        {editingId !== null && (
          <Button 
            onClick={() => {
              setEditingId(null)
              setInputText('')
            }} 
            variant="outline" 
            className="mt-2 ml-2"
          >
            Cancelar edición
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedTexts.map(({ id, content }) => (
          <Card key={id}>
            <CardContent className="p-4">
              <p className="mb-4">{content}</p>
              <div className="flex justify-between items-center">
                <Button onClick={() => handleCopy(id, content)} variant="outline" size="sm">
                  {copiedId === id ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" /> Copiar
                    </>
                  )}
                </Button>
                <div>
                  <Button onClick={() => handleEdit(id, content)} variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button onClick={() => handleDelete(id)} variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}