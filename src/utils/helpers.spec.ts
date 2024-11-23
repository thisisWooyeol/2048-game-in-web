import { describe, expect, test } from 'vitest';

import type { Map2048 } from '@/constants';
import {
  addRandomBlock,
  moveLeft,
  rotateMapCounterClockwise,
  validateMapIsNByM,
} from '@/utils/helpers';

describe('helpers.ts functions', () => {
  const emptyMap: Map2048 = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];

  describe('addRandomBlock', () => {
    test('should add a block to an empty map', () => {
      const newMap = addRandomBlock(emptyMap);
      const nonNullCells = newMap.flat().filter((cell) => cell !== null);
      expect(nonNullCells.length).toBe(1);
      expect(nonNullCells[0]).toBe(2);
    });

    test('should not modify a full map', () => {
      const fullMap: Map2048 = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ];
      const newMap = addRandomBlock(fullMap);
      expect(newMap).toEqual(fullMap);
    });
  });

  describe('moveLeft', () => {
    test('should move cells to the left', () => {
      const map: Map2048 = [
        [null, 2, null, 2],
        [4, null, 4, null],
        [2, 2, 2, 2],
        [null, null, null, null],
      ];
      const { map: newMap, isMoved, newPoints } = moveLeft(map);
      const expectedMap: Map2048 = [
        [4, null, null, null],
        [8, null, null, null],
        [4, 4, null, null],
        [null, null, null, null],
      ];
      expect(newMap).toEqual(expectedMap);
      expect(isMoved).toBe(true);
      expect(newPoints).toBe(20);
    });

    test('should not move if no movement is possible', () => {
      const map: Map2048 = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2048, 4096],
        [8192, 16384, 32768, 65536],
      ];
      const { map: newMap, isMoved, newPoints } = moveLeft(map);
      expect(newMap).toEqual(map);
      expect(isMoved).toBe(false);
      expect(newPoints).toBe(0);
    });
  });

  describe('validateMapIsNByM', () => {
    test('should return true for a valid map', () => {
      const isValid = validateMapIsNByM(emptyMap);
      expect(isValid).toBe(true);
    });

    test('should return false for an invalid map', () => {
      const invalidMap: Map2048 = [
        [null, null, null],
        [null, null],
        [null, null, null, null],
      ];
      const isValid = validateMapIsNByM(invalidMap);
      expect(isValid).toBe(false);
    });
  });

  describe('rotateMapCounterClockwise', () => {
    const map: Map2048 = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    test('should rotate 90 degrees', () => {
      const rotatedMap = rotateMapCounterClockwise(map, 90);
      const expectedMap: Map2048 = [
        [3, 6, 9],
        [2, 5, 8],
        [1, 4, 7],
      ];
      expect(rotatedMap).toEqual(expectedMap);
    });

    test('should rotate 180 degrees', () => {
      const rotatedMap = rotateMapCounterClockwise(map, 180);
      const expectedMap: Map2048 = [
        [9, 8, 7],
        [6, 5, 4],
        [3, 2, 1],
      ];
      expect(rotatedMap).toEqual(expectedMap);
    });

    test('should rotate 270 degrees', () => {
      const rotatedMap = rotateMapCounterClockwise(map, 270);
      const expectedMap: Map2048 = [
        [7, 4, 1],
        [8, 5, 2],
        [9, 6, 3],
      ];
      expect(rotatedMap).toEqual(expectedMap);
    });

    test('should return the same map when rotation degree is 0', () => {
      const rotatedMap = rotateMapCounterClockwise(map, 0);
      expect(rotatedMap).toEqual(map);
    });
  });
});
