class Filter {
  constructor(options) {
    this.$filter = document.querySelector('.filter');
    this.$minPriceSlider = this.$filter.querySelector('#min-price-range');
    this.$maxPriceSlider = this.$filter.querySelector('#max-price-range');
    this.$minPrice = this.$filter.querySelector('#min-price');
    this.$maxPrice = this.$filter.querySelector('#max-price');
    this.$sortPrice = this.$filter.querySelector('.price__sort');
    this.$brandList = this.$filter.querySelector('.brand__list');

    this.store = options.store;
    this.brands = ['Sea-Doo', 'kawasaki', 'Yamaha'];
    this.minPrice = 0;
    this.maxPrice = 1800000;
    this.step = 500;
    this.filterBrands = [];
  }

  init() {
    this.render();

    this.$minPriceSlider.addEventListener('input', this.sliderHandler.bind(this));
    this.$minPriceSlider.addEventListener('change', this.setMinPrice.bind(this));
    this.$maxPriceSlider.addEventListener('input', this.sliderHandler.bind(this));
    this.$maxPriceSlider.addEventListener('change', this.setMaxPrice.bind(this));
    this.$minPrice.addEventListener('input', this.setMinPrice.bind(this));
    this.$maxPrice.addEventListener('input', this.setMaxPrice.bind(this));
    this.$sortPrice.addEventListener('change', this.setSortPrice.bind(this));
    this.$brandList.addEventListener('change', this.setBrands.bind(this));
  }

  sliderHandler({target}) {
    if (target.dataset.range === 'min') {
      this.$minPrice.value = target.value;
      this.minPrice = +target.value;
    } else if (target.dataset.range === 'max') {
      this.$maxPrice.value = target.value;
      this.maxPrice = +target.value;
    }

    if (this.maxPrice <= this.minPrice) {
      this.ifMaxLessMin();
    }
  }

  ifMaxLessMin() {
    this.$minPriceSlider.value = this.maxPrice;
    this.minPrice = this.maxPrice;
    this.$minPrice.value = this.minPrice;
    this.maxPrice += this.step;
    this.$maxPriceSlider.value = this.maxPrice;
    this.$maxPrice.value = this.maxPrice;
  }

  setMinPrice({target}) {
    this.minPrice = target.value ? +target.value : this.minPrice;
    this.$minPriceSlider.value = this.minPrice;
    this._setPrice();
  }

  setMaxPrice({target}) {
    this.maxPrice = target.value ? +target.value : this.minPrice + this.step;
    this.$maxPriceSlider.value = this.maxPrice;
    this._setPrice();
  }

  _setPrice() {
    if (this.maxPrice < this.minPrice) {
      this.ifMaxLessMin();
    }

    this.store.dispatch({type: 'price', payload: {minPrice: this.minPrice, maxPrice: this.maxPrice, currentPage: 1} });
  }

  setSortPrice({target}) {
    this.store.dispatch({type: 'sort', payload: {sort: target.value, currentPage: 1} });
  }

  setBrands({target}) {
    const brandName = target.dataset.brand;
    const checked = target.checked;

    if (checked) {
      this.filterBrands.push(brandName);
    } else {
      this.filterBrands = this.filterBrands.filter(item => item !== brandName);
    }

    this.store.dispatch({type: 'brands', payload: {brands: this.filterBrands, currentPage: 1} });
  }

  render() {
    const list = this.brands.map(item => {
      return this.createElem(item);
    });

    this.$brandList.innerHTML = list.join(' ');
  }

  createElem(item) {
    return `
      <li class="brand__item">
        <label class="brand__item-label">
          <input type="checkbox" class="brand__item-input" data-brand="${item}">${item}
        </label>
      </li>
    `;
  }
}
