/*
 * This file is part of Booper, a bootstrap percolation visualization tool.
 * Copyright (C) 2020-2021 Connor Anderson <canderson@thaumavor.io>, Akshaj
 * Balasubramanian <bakshaj99@gmail.com>, Henry Poskanzer <hposkanzer@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";
 
export const LoadingSpinnerComponent = () => {
  const { promiseInProgress } = usePromiseTracker({delay: 500});
  const ICON_WIDTH = 100;
 
  return promiseInProgress &&
    <div style={{position: "absolute", zIndex: 2, backgroundColor: "#000000", opacity: 0.5, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Loader type="Grid" color="#ffffff" height={ICON_WIDTH} width={ICON_WIDTH} />
    </div>;
};
