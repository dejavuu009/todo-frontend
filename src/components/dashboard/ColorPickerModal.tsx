'use client'

import { Overlay, Popover, Button } from 'react-bootstrap'
import { RefObject } from 'react'

const colors = [
  '#FF8282', // czerwony
  '#FFDF87', // żółty
  '#6BCB77', // zielony
  '#AECBFA', // niebieski
  '#D6B3FF', // fioletowy
  '#FF8C42', // pomarańczowy
  '#2EC4B6', // turkusowy
  '#FFD4A3', // bursztynowy
  '#B983FF', // jasnofioletowy
  '#FFA8A8', // łososiowy
  '#B6B8F9', // indygo
  '#dbffcb', // miętowy
]

export default function ColorPickerModal({
  show,
  onClose,
  onColorSelect,
  selectedColor,
  targetRef,
}: {
  show: boolean
  onClose: () => void
  onColorSelect: (color: string) => void
  selectedColor: string | null
  targetRef: RefObject<HTMLElement | null>
}) {
  return (
    <Overlay target={targetRef.current} show={show} placement="top" rootClose onHide={onClose}>
      <Popover id="color-picker-popover" style={{ borderRadius: '1rem', padding: '0.4rem' }}>
        <Popover.Body style={{ borderBottomLeftRadius: '1rem', borderBottomRightRadius: '1rem' }}>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => {
                  onColorSelect(color)
                  onClose()
                }}
                style={{
                  backgroundColor: color,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: selectedColor === color ? '3px solid black' : '2px solid #ccc',
                }}
              />
            ))}
          </div>
        </Popover.Body>
      </Popover>
    </Overlay>
  )
} 
