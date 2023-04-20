import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, render, cleanup } from '@testing-library/react';

import matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers);

import FlashcardsList from '.';

describe("Flashcards List Page", () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <FlashcardsList />
            </BrowserRouter>
        )
    })
    
    afterEach(() => {
        cleanup();
    })

    it("Displays a heading", () => {
        const heading = screen.getByRole('heading')
        expect(heading).toBeInTheDocument();
        expect(heading.textContent).toContain("Flashcards")
    })

    it("Displays flashcard categories", () => {
        const flashcards = screen.getByRole('flashcards')
        expect(flashcards).toBeInTheDocument();
        console.log(flashcards.childNodes[1].textContent)
        // expect(flashcards.childNodes.length).toBe(9)
    })

})
