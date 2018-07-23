import { Version } from '@microsoft/sp-core-library';
import * as pnp from 'sp-pnp-js';
import { SPComponentLoader } from '@microsoft/sp-loader';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './SliderWebpartWebPart.module.scss';
import * as strings from 'SliderWebpartWebPartStrings';

export interface ISliderWebpartWebPartProps {
  description: string;
}
require('./app/style.css');
export default class SliderWebpartWebPart extends BaseClientSideWebPart<ISliderWebpartWebPartProps> {


  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      pnp.setup({
        spfxContext: this.context
      });

    });
  }

  public constructor() {
    super();
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');

    SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
      SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js', { globalExportsName: 'jQuery' }).then((): void => {

      });
    });
  }

  public getDataFromList(): void {
    var Id = [];
    var myHtml;
    var indicators;
    pnp.sp.web.lists.getByTitle('SliderCarousel').items.get().then(function (result) {
      //console.log("Got List Data:"+JSON.stringify(result));
      result.forEach(function (val, index) {
        pnp.sp.web.lists.getByTitle('SliderCarousel').items.getById(val.ID).fieldValuesAsHTML.get().then(function (data) {
          //Populate all field values for the List Item
          console.log("Slider Data:" + JSON.stringify(data));
          
          debugger
          var imgURL = data.PublishingPageImage;
          var tmp = imgURL.split("style");
          imgURL = tmp[0];
          if (index == 0) {
            indicators='<li data-target="#myCarousel" data-slide-to="'+index+'" class="active"></li>';
            myHtml = '<div class="item active">' + imgURL + '</div>';
          } else {
            indicators='<li data-target="#myCarousel" data-slide-to="'+index+'"></li>';
            myHtml = '<div class="item">' + imgURL + '</div>';
          }
          var temp = document.getElementById("indic");
          temp.innerHTML += indicators;
          var div = document.getElementById("slider");
          div.innerHTML += myHtml;
        });
      })
    }, function (er) {
      alert("Oops, Something went wrong, Please try after sometime");
      console.log("Error:" + er);
    });


  }
  public render(): void {
    this.domElement.innerHTML = `
    <div class="container">
    <div id="myCarousel" class="carousel slide" data-ride="carousel">
      <!-- Indicators -->
      <ol id="indic" class="carousel-indicators">
        
      </ol>
  
      <!-- Wrapper for slides -->
      <div class="carousel-inner" id="slider">
        
      
      </div>

    <!-- Left and right controls -->
    <a class="left carousel-control" href="#myCarousel" data-slide="prev">
      <span class="glyphicon glyphicon-chevron-left"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="right carousel-control" href="#myCarousel" data-slide="next">
      <span class="glyphicon glyphicon-chevron-right"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
</div>`;

    this.getDataFromList();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
