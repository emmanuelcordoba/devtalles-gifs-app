import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY = 'FgQvqSjh1q4YrELuUGZOTHt3fdlYKQXk';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = []

  private _tagsHistory: string[] = [];
  private giphyApiKey = 'FgQvqSjh1q4YrELuUGZOTHt3fdlYKQXk';
  private serviceUrl = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient){
    this.loadLocalStorage();
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string){
    tag = tag.toLocaleLowerCase();

    if(this._tagsHistory.includes(tag))
    {
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag)
    }

    this._tagsHistory.unshift(tag)
    this._tagsHistory = this._tagsHistory.splice(0,10);

    this.saveLocalStorage();
  }

  private loadLocalStorage(): void {
    if(!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if(this._tagsHistory.length > 0)
    {
      this.searchTag(this._tagsHistory[0]);
    }
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  searchTag(tag: string): void {

    if(tag.length === 0 ) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.giphyApiKey)
      .set('limit', 10)
      .set('q', tag);

    this.http.get<SearchResponse>(this.serviceUrl+'/search', { params })
      .subscribe( res => {
        this.gifList = res.data;
        //console.log(res);
      })
  }
}
