export const waitForPageLoadInTab = (tabId: number) => {
  return new Promise((resolve) => {
    chrome.tabs.onUpdated.addListener(function listener(
      updatedTabId: number,
      info: chrome.tabs.TabChangeInfo
    ) {
      if (info.status === 'complete') {
        if (updatedTabId === tabId) {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve(void 0);
        }
      }
    });
  });
};

export const createTabUrl = async (url: string): Promise<chrome.tabs.Tab> => {
  const tab = await chrome.tabs.create({ url });
  if (!tab.id) {
    throw new Error('Failed to create tab');
  }
  await waitForPageLoadInTab(tab.id);
  return tab;
};

export const updateTabUrl = async (
  tabId: number,
  url: string
): Promise<chrome.tabs.Tab> => {
  const tab = await chrome.tabs.update(tabId, { url });
  if (!tab.id) {
    throw new Error('Failed to update tab');
  }
  await waitForPageLoadInTab(tab.id);
  return tab;
};

export const isCartSuccessUrl = (url: string): boolean => {
  // Kiểm tra tổng quát hơn bằng cách sử dụng regex hoặc kiểm tra đường dẫn
  // Hỗ trợ cả http và https, cũng như www và non-www domains
  return /https?:\/\/(www\.)?udemy\.com\/cart\/success(\/|$)/.test(url);
};

export const isPaymentCheckoutUrl = (url: string): boolean => {
  return url.includes('/payment/checkout/');
};
