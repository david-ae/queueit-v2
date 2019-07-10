import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './_services';
import { AlertComponent } from './_directives';
import { FeatherModule } from 'angular-feather';
import { Menu, Camera, Heart, Github, 
  Calendar, Archive, AtSign, BarChart2 ,
  BookOpen, Check, Cloud, Award,
  Bell, Book, ChevronRight, ChevronLeft,
  Home, Clock, Coffee, Database,
  Download, Edit3, Delete, Activity,
  Filter, File, Folder, User, 
  Settings, Server, Save, Search,
  Send, Share2, Star, Sun  ,
  MinusCircle,
  Grid,UserCheck, Map
} from 'angular-feather/icons';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { MobxAngularModule } from 'mobx-angular';

const icons = {
  Menu,
  MinusCircle,
  Home,
  Map,
  Camera,
  User,
  UserCheck,
  Heart,
  ChevronRight,
  Github,
  Book,
  AtSign,
  Award,
  Filter,
  Database,
  Settings,
  Activity,
  BookOpen
}

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    NgbModule,
    MobxAngularModule,
    NgxPaginationModule,
    FeatherModule.pick(icons)
  ],
  declarations: [AlertComponent],
  exports:[AlertComponent, FeatherModule, NgxSpinnerModule,
          NgbModule, NgxPaginationModule, MobxAngularModule],
  providers: [AlertService, NgxSpinnerModule]
})
export class SharedModule { }
