import React, { Component } from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
 
export const LoadingSpinnerComponent = (props) => {
	const { promiseInProgress } = usePromiseTracker();
	const ICON_WIDTH = 100;
 
	return promiseInProgress &&
    	<div style={{position: "absolute", left: (props.paneWidth - ICON_WIDTH) / 2, top: (props.paneHeight - ICON_WIDTH) / 2, zIndex: 1}}>
			<Loader type="Grid" color="#000000" height={ICON_WIDTH} width={ICON_WIDTH} />
  		</div>
};