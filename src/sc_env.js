import { SmartEnv } from 'smart-environment';

export class ScEnv extends SmartEnv {
  constructor(plugin, opts={}) {
    super(plugin, opts);
    this.local_model_type = 'Web'; // DEPRECATED???
    this.dv_ws = null; // soon to be deprecated
    this.chat = null; // likely to be deprecated
  }
  get file_exclusions() {
    // return (this.plugin.settings.file_exclusions?.length) ? this.plugin.settings.file_exclusions.split(",").map((file) => file.trim()) : [];
    return (this.settings.file_exclusions?.length) ? this.settings.file_exclusions.split(",").map((file) => file.trim()) : [];
  }
  get folder_exclusions() {
    return (this.settings.folder_exclusions?.length) ? this.settings.folder_exclusions.split(",").map((folder) => {
      folder = folder.trim();
      if (folder.slice(-1) !== "/") return folder + "/";
      return folder;
    }) : [];
  }
  get excluded_headings() {
    if (this._excluded_headings) return this._excluded_headings;
    return this._excluded_headings = (this.settings.excluded_headings?.length) ? this.settings.excluded_headings.split(",").map((heading) => heading.trim()) : [];
  }
  get system_prompts() {
    return this.smart_connections_plugin.app.vault.getMarkdownFiles()
      .filter(file => file.path.includes(this.settings.system_prompts_folder) || file.path.includes('.prompt') || file.path.includes('.sp'));
  }
  /**
   * @deprecated Use this.smart_connections_plugin.env_data_dir instead
   */
  get data_path() { return this.settings.smart_connections_folder; } // DEPRECATED??
  /**
   * @deprecated Use this.settings instead
   */
  get config() { return this.settings; } // DEPRECATED
  // SMART FS
  get excluded_patterns() {
    return [
      ...(this.file_exclusions?.map(file => `${file}**`) || []),
      ...(this.folder_exclusions || []).map(folder => `${folder}**`),
      this.smart_connections_plugin.env_data_dir + "/**",
    ];
  }

  unload() {
    if(this.dv_ws) this.dv_ws.unload();
    super.unload();
  }
  // // Smart Connect integration
  // async check_for_smart_connect_import_api() {
  //   try {
  //     const request_adapter = this.plugin.obsidian?.requestUrl || null;
  //     const sc_local = !request_adapter ? await fetch('http://localhost:37421/') : await request_adapter({ url: 'http://localhost:37421/', method: 'GET' });
  //     // console.log(sc_local);
  //     if (sc_local.status === 200) {
  //       console.log('Local Smart Connect server found');
  //       this.smart_sources.import = async (files = null) => {
  //         const requestUrl = this.plugin.obsidian.requestUrl;
  //         const resp = await requestUrl({ url: 'http://localhost:37421/import_entities', method: 'POST' });
  //         console.log("import resp: ", resp.json);
  //         if (resp.json.notice === 'recently imported') {
  //           this.plugin.notices.show('imported from Smart Connect', [`[Smart Connect] ${resp.json.message}`, resp.json.notice], { timeout: 10000 });
  //           return;
  //         }
  //         this.plugin.notices.show('importing from Smart Connect', [`[Smart Connect] ${resp.json.message}`, resp.json.notice], { timeout: 10000 });
  //         let follow_up_resp = { json: { message: '' } };
  //         while (follow_up_resp.json.message !== 'recently imported') {
  //           follow_up_resp = await requestUrl({ url: 'http://localhost:37421/import_entities', method: 'POST' });
  //           this.plugin.notices.remove('importing from Smart Connect');
  //           this.plugin.notices.show('importing from Smart Connect', [`[Smart Connect] ${follow_up_resp.json.message}`, follow_up_resp.json.notice], { timeout: 10000 });
  //           await new Promise(resolve => setTimeout(resolve, 3000));
  //           console.log("follow_up_resp: ", follow_up_resp);
  //         }
  //         this.plugin.notices.remove('importing from Smart Connect');
  //         this.plugin.notices.show('imported from Smart Connect', [`[Smart Connect] ${follow_up_resp.json.message}`, follow_up_resp.json.notice], { timeout: 10000 });
  //         console.log("done importing from Smart Connect");
  //         // this.reload_collections(); // needs implementation
  //       };
  //       this.smart_blocks.import = this.smart_sources.import;
  //       console.log("smart_sources.import: ", this.smart_sources.import);
  //       console.log("smart_blocks.import: ", this.smart_blocks.import);
  //       // return;
  //     }
  //   } catch (err) {
  //     console.log('Could not connect to local Smart Connect server');
  //   }
  // }
  // DEPRECATED: Smart Visualizer backwards compatibility
  /**
   * @deprecated Use this.collections_loaded instead
   */
  get entities_loaded() { return this.collections_loaded; }
  /**
   * @deprecated Use this.smart_sources instead
   */
  get smart_notes() { return this.smart_sources; }
}