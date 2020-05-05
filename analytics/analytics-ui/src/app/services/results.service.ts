/*
 * Copyright 2019-2020 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class ResultsService {
  results = [];

  constructor() { }

  /** Get the results */
  get = function() {
    return this.results;
  };

  /** Clear the results */
  clear = function() {
    this.results = [];
  };

  /** Update the results */
  update = function(newResults) {
    if (newResults != null && newResults !== '') {
      // Convert it to an array if theres only one result
      if (!Array.isArray(newResults)) {
        newResults = [newResults];
      }
      this.results = newResults;
    }
  };
}
