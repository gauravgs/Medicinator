import React, { Component, useState } from 'react';
import { WebView } from 'react-native-webview';


class PredictDisease extends Component {
    constructor(props) {
        super(props);
    }

    onNavigationStateChange = navState => {
        const { url } = navState;
        if (!url) return;

    };

    render() {
        const RenderWebView = (
            <>
              
            </>
          );

          return (
            <WebView
            source={{
              uri: 'https://diseasepredictorapp.herokuapp.com/',
            }}
            onNavigationStateChange={this.onNavigationStateChange}
            startInLoadingState
            scalesPageToFit
            javaScriptEnabled
            style={{ flex: 1 }}
          />
          );
    }
}

export default PredictDisease;