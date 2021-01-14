import React, { Component } from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
 
export const LoadingSpinnerComponent = (props) => {
	const { promiseInProgress } = usePromiseTracker({delay: 500});
	const ICON_WIDTH = 100;
 
	return promiseInProgress &&
    	<div style={{position: "absolute", zIndex: 1, backgroundColor: "#000000", opacity: 0.5, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
			<Loader type="Grid" color="#ffffff" height={ICON_WIDTH} width={ICON_WIDTH} />
  		</div>
};